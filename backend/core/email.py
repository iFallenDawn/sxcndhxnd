import os
import resend
import logging
from core.constants import FROM_ADDRESS

logger = logging.getLogger(__name__)

resend.api_key = os.environ.get("RESEND_API_KEY") or ""

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
        
