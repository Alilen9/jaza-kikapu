import base64
import requests
from datetime import datetime
from django.conf import settings
from apps.orders.models import ParentOrder

class DarajaMpesaService:
    @staticmethod
    def get_access_token():
        consumer_key = settings.MPESA_CONSUMER_KEY
        consumer_secret = settings.MPESA_CONSUMER_SECRET
        api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

        response = requests.get(api_url, auth=(consumer_key, consumer_secret))
        if response.status_code == 200:
            return response.json().get('access_token')
        raise Exception(f"Failed to fetch M-Pesa access token: {response.text}")

    @classmethod
    def initiate_stk_push(cls, phone_number: str, amount: int, order_id: str):
        access_token = cls.get_access_token()
        business_shortcode = settings.MPESA_SHORTCODE # e.g. 174379
        passkey = settings.MPESA_PASSKEY
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        
        password_str = f"{business_shortcode}{passkey}{timestamp}"
        password = base64.b64encode(password_str.encode()).decode('utf-8')

        # Clean Kenyan phone format
        clean_phone = phone_number.replace('+', '').replace(' ', '')
        if clean_phone.startswith('0'):
            clean_phone = f"254{clean_phone[1:]}"

        payload = {
            "BusinessShortCode": business_shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": clean_phone,
            "PartyB": business_shortcode,
            "PhoneNumber": clean_phone,
            "CallBackURL": f"{settings.BACKEND_URL}/api/v1/payments/mpesa/callback/",
            "AccountReference": f"KIKAPU-{order_id[:8]}",
            "TransactionDesc": "Jaza Kikapu Local Market Order"
        }

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        res = requests.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers=headers
        )
        return res.json()
