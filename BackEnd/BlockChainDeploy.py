from solcx import compile_standard, install_solc 
import json
from web3 import Web3

# install_solc('0.8.28')

def do_Transaction(prescription_data):
    with open("BlockChain.sol", "r") as file:
        simple_storage_file = file.read()

    compiled_sol = compile_standard(
        {
            "language": "Solidity",  
            "sources": {"BlockChain.sol": {"content": simple_storage_file}},
            "settings": {
                "outputSelection": {
                    "*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}
                }
            },
        },
        solc_version="0.8.18", 
    )

    with open("compiled_code.json", "w") as file:
        json.dump(compiled_sol, file)

    bytecode = compiled_sol["contracts"]["BlockChain.sol"]["PrescriptionStorage"]["evm"][
        "bytecode"
    ]["object"]

    abi = compiled_sol["contracts"]["BlockChain.sol"]["PrescriptionStorage"]["abi"]

    w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))
    chain_id = 1337
    my_address = "0x807142621f3851bAfF51f50E5aB83aC150Ace7fD"
    private_key = "0x9c08ca55c4aee7c782bd496c3f5cce223fb118a09f08757930a4f11baf626a02"

    PrescriptionStorage = w3.eth.contract(abi=abi, bytecode=bytecode)

    nonce = w3.eth.get_transaction_count(my_address)
    print(nonce)

    transaction = PrescriptionStorage.constructor().build_transaction({
        "chainId": chain_id,
        "from": my_address,
        "nonce": nonce,
        'gas': 5000000,
        'gasPrice': w3.to_wei('20', 'gwei'),
    })

    signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)    
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    prescription_storage = w3.eth.contract(address=tx_receipt.contractAddress, abi=abi)

    # Extract prescription data
    email = prescription_data["patientEmail"]
    tablets = prescription_data["prescription"]

    # Store prescription data
    for i, tablet in enumerate(tablets):
        add_tablet_txn = prescription_storage.functions.addTablet(
            tablet["tablet"], tablet["count"], tablet["times"]
        ).build_transaction({
            "chainId": chain_id,
            "from": my_address,
            "nonce": nonce + 1 + i,
            'gas': 5000000,
            'gasPrice': w3.to_wei('20', 'gwei'),
        })

        signed_store_txn = w3.eth.account.sign_transaction(add_tablet_txn, private_key=private_key)
        store_tx_hash = w3.eth.send_raw_transaction(signed_store_txn.raw_transaction)    
        w3.eth.wait_for_transaction_receipt(store_tx_hash)

    print(prescription_storage.functions.getPrescription().call())
    print("Transaction Address : ", tx_receipt.contractAddress)

    return tx_receipt.contractAddress

# Example usage
# if __name__ == "__main__":
#     external_data = {
#         "email": "patient@example.com",
#         "tablets": [
#             {"tablet": "Paracetamol", "count": 2, "times": ["morning", "night"]},
#             {"tablet": "Ibuprofen", "count": 1, "times": ["afternoon"]}
#         ]
#     }

#     do_Transaction(external_data)
