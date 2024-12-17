from web3 import Web3
import json

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))

contract_address = "0x1510bc92f5864E61Ad827D188B96008a2EB74802"
print(f"Contract deployed at: {contract_address}")


with open("compiled_code.json", "r") as file:
    compiled_sol = json.load(file)

abi = compiled_sol["contracts"]["BlockChain.sol"]["PrescriptionStorage"]["abi"]

prescription_storage = w3.eth.contract(address=contract_address, abi=abi)

prescription_data = prescription_storage.functions.getPrescription().call()

print(f"Prescription data: {prescription_data}")
