# FastAPI Backend

## Getting Started

Run the server
```bash
fastapi dev main.py
```


### WSL Setup

Open remote WSL, clone repository in the Ubuntu distro.

Install [uv](https://github.com/astral-sh/uv)
```bash
# On macOS and Linux.
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Create virtual environment
```bash
cd backend
uv venv
```
Install the requirements
```bash
uv pip sync requirements.txt
```
Anytime you develop, activate the virtual environment
```bash
source .venv/bin/activate
```
Set Python interpreter to your venv
```
.venv/bin/python3.13
```

### Errors
If you get an error trying to create the virtual environment, install [brew](https://brew.sh/) and then run
```bash
brew install python
```