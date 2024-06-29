from flask import *
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy 
import random
from flask_mail import *

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/balancedbites'
db = SQLAlchemy(app)
app.secret_key = 'lone_wolf'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your-gmail-id'
app.config['MAIL_PASSWORD'] = 'your-email-password'
app.config['MAIL_DEFAULT_SENDER'] = 'your-gmail-id'
mail = Mail(app)

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('user', 'admin'), default='user')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'
    
@app.route('/')
def hello():
    return render_template('signup_in.html')
email_verified = False
@app.route("/signup",methods=['GET','POST'])
def signup():
    try:
        if request.method == 'POST':
            username = request.form['n_username']
            email = request.form['new-email']
            password = request.form['new-password']
            new_user = Users(username=username, email=email, password_hash=password)
            existing_user = new_user.query.filter_by(username=username).first()
            existing_email = new_user.query.filter_by(email=email).first()
            
            if existing_user or existing_email:
                username_taken = f"'{username}' Username/Email Already Taken !!!"
                print('Username or Email already exists')
                return render_template('/signup_in.html', username_taken=username_taken)
            else:
                if email_verified:
                    new_user = Users(username=username, email=email, password=password)
                    db.session.add(new_user)
                    db.session.commit()
                    print("Email Verified")
                    return render_template('/signup_in.html', success_message="You Have Successfully Signed Up !")
                else:
                    print("Not verified")
                    failure_message = f"Please Verify Email First !"
                return render_template('/signup_in.html', failure_message=failure_message)
    except KeyError as e:
        print(f"Missing form data: {e}")
        return render_template('/signup_in.html', failure_message="Form data missing.")
    print("Default Case")
    return render_template('/signup_in.html')

@app.route("/send_email_otp", methods=['POST'])
def send_email_otp():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request payload is missing'}), 400
        
        email = data.get('email')
        if not email:
            return jsonify({'error': 'Email is required'}), 400

        username = data.get('username')
        if not username:
            return jsonify({'error': 'Username is required in session'}), 400

        # Query to check if username or email already exists
            
        # If the username and email are not taken, generate and send the OTP
        otp = random.randint(100000, 999999)
        session['generated_otp'] = otp
        print("Generated OTP:", otp)

        msg = Message(
            'Your OTP is Here to get started WIth InfyMail Marketing !',
            sender='web8wizards@gmail.com',
            recipients=[email]
        )
        msg.html = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your infyMail Marketing OTP Code</title>
            </head>
            <body style="background-color: #e0e0e0; font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #e0e0e0; width: 100%; text-align: center;">
                    <tr>
                        <td>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(10px); border-radius: 10px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); width: 100%; max-width: 600px; margin: 40px auto;">
                                <tr>
                                    <td style="background-color: #0073e6; color: #ffffff; height: 60px; padding: 10px 0; border-top-left-radius: 10px; border-top-right-radius: 10px; text-align: center;">
                                        <h1 style="margin: 0; font-size: 24px;">infyMail Marketing</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 30px; text-align: left;">
                                        <p style="margin: 0 0 20px 0; font-size: 18px; color: #333333;">Hello, <b>{ username }</b></p>
                                        <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Your One-Time Password (OTP) for verification is:</p>
                                        <div style="font-size: 24px; font-weight: bold; color: #0073e6; margin: 20px 0; text-align: center;">{ otp }</div>
                                        <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Please use this OTP to complete your verification process. Do not share this code with anyone.</p>
                                        <p style="margin: 0; font-size: 16px; color: #333333;">Thank you!</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center; font-size: 12px; color: #777777; padding: 20px;">
                                        <p style="margin: 0 0 10px 0;">If you did not request this code, please ignore this email.</p>
                                        <p style="margin: 0;">&copy; infyMail Marketing. All rights reserved.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        """
        mail.send(msg)
        return jsonify({'otp': otp}), 200

    except smtplib.SMTPAuthenticationError as e:
        print(f"SMTP Authentication Error: {str(e)}")
        return jsonify({'error': 'SMTP Authentication Error'}), 500
    except smtplib.SMTPConnectError as e:
        print(f"SMTP Connect Error: {str(e)}")
        return jsonify({'error': 'SMTP Connect Error'}), 500
    except smtplib.SMTPException as e:
        print(f"SMTP Error: {str(e)}")
        return jsonify({'error': 'SMTP Error'}), 500
    except Exception as e:
        print(f"Error in /send_email_otp: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/signin',methods=['POST'])
def indexcall():
    return render_template('index.html')

@app.route("/calorietracker",methods=['GET'])
def calorieTracker():
    return render_template('calorieTracker.html')

@app.route('/bmicalc',methods=['GET'])
def bmicalculator():
    render_template('bmiCalc.html')
    return jsonify({'error': 'Request payload is missing'})

@app.route('/update_email_verified', methods=['POST'])
def update_otp_status():
    global email_verified
    data = request.get_json()
    print(data)
    if not data:
        return jsonify({'error': 'Request payload is missing'}), 400
    
    user_otp = data.get('otp')
    print(user_otp)
    if not user_otp:
        return jsonify({'error': 'OTP is required'}), 400

    generated_otp = session.get('generated_otp')
    print(generated_otp)
    if not generated_otp:
        return jsonify({'error': 'No OTP generated for this session'}), 400

    if int(user_otp) == generated_otp:
        email_verified = True
        session.pop('generated_otp', None)  # Clear the OTP after successful verification
        return jsonify({'success': 'OTP verified successfully!'}), 200
    else:
        return jsonify({'error': 'Invalid OTP'}), 400
if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')
