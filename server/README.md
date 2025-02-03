# FastAPI Backend

## Getting Started

Setup a [virtual environment](https://fastapi.tiangolo.com/virtual-environments/#create-a-virtual-environment)

Make sure you are in a WSL terminal

should just be
```bash
cd server
python -m venv .venv
```

Anytime you develop, activate the virtual environment
```bash
source .venv/bin/activate
```
Install all the packages
```bash
pip install -r requirements.txt
```
Run the server
```bash
fastapi dev main.py
```