import os
import sys
import subprocess

def main():
    print("=" * 60)
    print("🚀 Launching Unified HireAI Application (Combined Full-Stack)")
    print("=" * 60)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, 'backend')
    python_exe = os.path.join(backend_dir, 'venv', 'Scripts', 'python.exe')

    if not os.path.exists(python_exe):
        python_exe = sys.executable

    manage_py = os.path.join(backend_dir, 'manage.py')

    print(f"➜ Starting Django Combined Server on http://127.0.0.1:8000...")
    print(f"➜ Serving React SPA & REST APIs simultaneously on port 8000!\n")

    cmd = [python_exe, manage_py, "runserver", "8000"]
    subprocess.run(cmd, cwd=backend_dir)

if __name__ == '__main__':
    main()
