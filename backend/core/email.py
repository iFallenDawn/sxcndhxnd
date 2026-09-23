import os
import resend
import logging

logger = logging.getLogger(__name__)

FROM_ADDRESS = "sxcndhxnd <noreply@sxcndhxnd.com>"
resend.api_key = os.environ.get("RESEND_API_KEY") or ""
ADMIN_NOTIFICATION_EMAIL = os.environ.get("ADMIN_NOTIFICATION_EMAIL") or ""
DASHBOARD_URL = "https://sxcndhxnd.com/dashboard"
INSTAGRAM_URL = "https://www.instagram.com/sxcndhxnd/"

async def send_email(
    to: str,
    subject: str,
    html: str
) -> None:
    try:
        resend.Emails.send({
            "from": FROM_ADDRESS,
            "to": to,
            "subject": subject,
            "html": html,
        })
    except Exception as e:
        logger.error(f"Failed to send email to {to}: {e}")

async def send_admin_reservation_notification(title: str, instagram: str) -> None:
    if not ADMIN_NOTIFICATION_EMAIL:
        logger.error("ADMIN_NOTIFICATION_EMAIL not sent, skipping admin notification")
    
    subject = f"'{title}' has been reserved by {instagram}!"
    html = f"""
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html style="height:100%" dir="ltr" lang="en">
            <head></head>
            <body>
                <p>Product '<strong>{title}</strong>' has been reserved by <strong>{instagram}</strong>.</p>
                <p><a href="{DASHBOARD_URL}">View in dashboard</a></p>
            </body>
        </html>
    """
    await send_email(ADMIN_NOTIFICATION_EMAIL, subject, html)
    
async def send_customer_reservation_notification(to: str, title: str) -> None:
    subject = f"sxcndhxnd - Your item '{title}' has been reserved!"
    html = f"""
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html style="height:100%" dir="ltr" lang="en">
            <head></head>
            <body>
                <p>Your item '<strong>{title}</strong>' has been reserved!</p>
                <p>Nico will be reaching out to you shortly via <a href="{INSTAGRAM_URL}">Instagram</a>.</p>
            </body>
        </html>
    """
    await send_email(to, subject, html)
    