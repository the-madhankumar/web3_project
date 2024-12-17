import sqlite3
from typing import Optional
from fastapi.params import Query
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import HTMLResponse
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from BlockChainDeploy import do_Transaction

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EMAIL_ADDRESS = "madhankumarbusiness@gmail.com"
EMAIL_PASSWORD = "runp vloe fdgi iqyi"


class SignupData(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    hospitalCertificate: str
    doctorCertificate: str


# Database setup
def get_db_connection():
    conn = sqlite3.connect('database.db', check_same_thread=False)
    # conn.row_factory = sqlite3.Row  # Enables access to rows as drictionaries
    return conn

# Models
class Doctor(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    verified: str
    role: str 

class Pharmist(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    role: str 
    DLN : str

class Patient(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    role: str 

class Tablet(BaseModel):
    tablet: str
    count: int
    times: list[str]

class PrescriptionData(BaseModel):
    name: str
    patientEmail: str
    date: str
    prescription: list[Tablet]

class LoginData(BaseModel):
    role: str
    email: str
    password: str

class EmailRequest(BaseModel):
    email: str

class AddressRequest(BaseModel):
    address: str

# API Endpoints
@app.get("/")
def read_root():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT name FROM doctors')  
        doctors = cursor.fetchall()
        cursor.execute('SELECT name FROM patients')
        Patients = cursor.fetchall()
        conn.close()
        
        doctor_names = [row["name"] for row in doctors]
        patient_names = [row["name"] for row in Patients]
        return {"doctor_names": doctor_names}, {"patient_names": patient_names}



    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/verify-certificate")
async def verify_certificate(email: str, status: str):
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    doctor_verification = cursor.execute("Select verified from doctors where email=?", (email,)).fetchone()
    if doctor_verification[0] == "verified":
        doit = cursor.execute("update doctors set verified='verified' where email=?", (email,)).fetchone()
        isdone = cursor.execute("Select verified from doctors where email=?", (email,)).fetchone()
        conn.commit()
        print(isdone)
        return {"message": "Doctor already verified"}
    

    response_message = "Certificate accepted. Doctor is verified!" if status == "accepted" else "Certificate declined. Doctor is not verified."
    return HTMLResponse(content=response_message, status_code=200)



@app.post("/doctor")
def create_doctor(doctor: Doctor):
    if not doctor:
        raise HTTPException(status_code=400, detail="No doctor data provided")

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO doctors (name, email, phone, password, verified, role)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (doctor.name, doctor.email, doctor.phone, doctor.password,
              doctor.verified, doctor.role))
        conn.commit()
        doctor_id = cursor.lastrowid
        conn.close()
        return {"message": "Doctor created successfully, But Not verified", "doctor_id": doctor_id}

    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Doctor with this email already exists")
    except AttributeError:
        raise HTTPException(status_code=400, detail="Invalid doctor data")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/pharm")
def create_doctor(pharm: Pharmist):
    if not pharm:
        raise HTTPException(status_code=400, detail="No doctor data provided")

    try:
        print(pharm)
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO pharmist (name, email, phone, password, role, DLN)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (pharm.name, pharm.email, pharm.phone, pharm.password, pharm.role , pharm.DLN))
        conn.commit()
        conn.close()
        return {"message": "Pharmist created successfully"}

    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Pharmist with this email already exists")
    except AttributeError:
        raise HTTPException(status_code=400, detail="Invalid pharmist data")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
     
@app.post("/api/signup")
async def signup(doctor: Doctor):
    # Generate Accept and Decline links
    hospital_email = "madhankumarconsortium@gmail.com"  # Replace with actual hospital email
    accept_link = f"http://localhost:8000/verify-certificate?email={doctor.email}&status=accepted"
    decline_link = f"http://localhost:8000/verify-certificate?email={doctor.email}&status=declined"


    # Create email content
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Doctor Certificate Verification"
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = hospital_email
    html_content = f"""
    <html>
      <body>
        <p>A new doctor has signed up with the following details:</p>
        <ul>
          <li>Name: {doctor.name}</li>
          <li>Email: {doctor.email}</li>
          <li>Phone: {doctor.phone}</li>
        </ul>
        <p>Certificates are attached for verification. Please click below to respond:</p>
        <a href="{accept_link}" style="margin-right:10px;padding:10px 20px;background-color:green;color:white;text-decoration:none;">Accept</a>
        <a href="{decline_link}" style="padding:10px 20px;background-color:red;color:white;text-decoration:none;">Decline</a>
      </body>
    </html>
    """
    msg.attach(MIMEText(html_content, "html"))

    # Send email
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, hospital_email, msg.as_string())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending email: {e}")

    return {"message": "Signup successful, verification email sent."}

@app.get("/get-status")
async def get_status(email: str):
    if email not in doctor_data:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return {"email": email, "status": doctor_data[email]["status"]}


@app.post("/patient")
def create_patient(patient: Patient):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO patients (name, email, phone, password, role)
            VALUES (?, ?, ?, ?, ?)
        ''', (patient.name, patient.email, patient.phone, patient.password, patient.role))
        conn.commit()
        patient_id = cursor.lastrowid
        conn.close()
        return {"message": "Patient created successfully", "patient_id": patient_id}

    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Patient with this email already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Database initialization (optional, for testing purposes)
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            password TEXT NOT NULL,
            verified TEXT,
            role TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pharmist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            DLN TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS patientAddress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            date DATE NOT NULL,
            transaction_address TEXT NOT NULL,
            FOREIGN KEY (email) REFERENCES patients (email) ON DELETE CASCADE
        );
    ''')
    conn.commit()
    conn.close()


@app.post("/submit-prescription")
async def submit_prescription(prescription_data: PrescriptionData):
    try:
        # Debug: Print prescription data for validation
        print("Received Prescription Data:", prescription_data)

        # Prepare the data for the blockchain transaction
        transaction_data = {
            "patientEmail": prescription_data.patientEmail,
            "prescription": [
                {
                    "tablet": tablet.tablet,
                    "count": tablet.count,
                    "times": tablet.times
                }
                for tablet in prescription_data.prescription
            ]
        }
        print("Prepared Transaction Data:", transaction_data)

        # Call the blockchain transaction function
        tx_address = do_Transaction(transaction_data)

        # Handle the case where transaction fails
        if not tx_address:
            return {"error": "Transaction failed. No address returned."}

        # Connect to the database
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert name, email, date, and transaction address into the database
        cursor.execute('''
            INSERT INTO patientAddress (name, email, date, transaction_address)
            VALUES (?, ?, ?, ?)
        ''', (prescription_data.name, prescription_data.patientEmail, prescription_data.date, tx_address))

        # Commit the transaction
        conn.commit()

        # Close the connection
        conn.close()

        # Return success message with the transaction address
        return {
            "message": "Prescription submitted successfully",
            "Tx_address": tx_address
        }

    except Exception as e:
        # Print and return error details
        print("Error occurred:", e)
        return {"error": f"An error occurred: {str(e)}"}
    
    except Exception as e:
        print("Error occurred:", e)
        return {"error": "An error occurred while submitting the prescription"}



@app.post("/login")
async def login(login_data: LoginData):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Determine the table based on role
    table_name = "doctors" if login_data.role == "doctor" else ("patients" if login_data.role == "patient" else "pharmist") 

    # Fetch user data
    cursor.execute(f"SELECT * FROM {table_name} WHERE email=?", (login_data.email,))
    user = cursor.fetchone()
    conn.close()

    if user:
        # Map the user data to the corresponding schema
        if login_data.role == "doctor":
            user_data = {
                "id": user[0],
                "name": user[1],
                "email": user[2],
                "phone": user[3],
                "password": user[4],
                "verified": user[5],
                "role": user[6]
            }
        elif login_data.role == "patient":  # Patient schema
            user_data = {
                "id": user[0],
                "name": user[1],
                "email": user[2],
                "phone": user[3],
                "password": user[4],
                "role": user[5]
            }
        
        else:
            user_data = {
                "id": user[0],
                "name": user[1],
                "email": user[2],
                "phone": user[3],
                "password": user[4],
                "role": user[5],
                "DLN": user[6]
            }

        return {"message": "Login successful", "user": user_data}
    else:
        return {"message": f"No {login_data.role} found"}

# @app.post('/qrhash')
# def get_qrhash(email : str):
#     conn = get_db_connection()
#     print(email)
#     cursor = conn.cursor()
#     cursor.execute('SELECT * FROM patientAddress ORDER BY id DESC')
#     qrhash = cursor.fetchall()
#     result = []
#     if qrhash:
#         print(qrhash)
#         for item in qrhash:
#             if item[2] == email:
#                 result.append({
#                     'DoctorName': item[1],
#                     'PatientEmail': item[2],
#                     'date': item[3],
#                     'transaction_address': item[4]
#                 })
#     else:
#         print("ulla varla")
#     conn.close()
#     return {"message":"done successfully","result":result}


@app.post('/qrhash')
def get_qrhash(request: EmailRequest):
    email = request.email  # Extract the email from the request body
    conn = get_db_connection()
    print(email)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM patientAddress ORDER BY id DESC')
    qrhash = cursor.fetchall()
    result = []
    if qrhash:
        print(qrhash)
        for item in qrhash:
            if item[2] == email:
                result.append({
                    'DoctorName': item[1],
                    'PatientEmail': item[2],
                    'date': item[3],
                    'transaction_address': item[4]
                })
    else:
        print("No records found")
    conn.close()
    return {"message": "done successfully", "result": result}

@app.post('/getData')
def GetBlockChainData(tx_address: AddressRequest):
    print(tx_address.address)
    from web3 import Web3
    import json

    w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))

    # contract_address = "0x3AFA49338A13cFD7f463A847d59f89B7A1ae3E91"
    print(f"Contract deployed at: {tx_address.address}")


    with open("compiled_code.json", "r") as file:
        compiled_sol = json.load(file)

    abi = compiled_sol["contracts"]["BlockChain.sol"]["PrescriptionStorage"]["abi"]

    prescription_storage = w3.eth.contract(address=tx_address.address, abi=abi)

    prescription_data = prescription_storage.functions.getPrescription().call()

    print(f"Prescription data: {prescription_data}")
    return prescription_data

# Uncomment the following line to initialize the database when running the script for the first time
# init_db()
