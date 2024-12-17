from web3 import Web3

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))  # Replace with your provider
code = w3.eth.get_code("0x46D54e32254b2A40496c829011B6369381884A87")
if code == b"":
    print("No contract deployed at this address.")
else:
    print("Contract code found.")
