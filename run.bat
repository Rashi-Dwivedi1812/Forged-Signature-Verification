@echo off
REM =====================================================
REM Signature Verification App Launcher (Streamlit + Anaconda)
REM Prevents repeated execution by disabling auto-reload
REM =====================================================

REM Navigate to project directory
cd /d "C:\Users\shrey\Desktop\Forged signature"

REM Activate Anaconda base environment (change if needed)
call C:\Users\shrey\anaconda3\Scripts\activate.bat

REM Set max upload size for large .h5 files (in MB)
set STREAMLIT_SERVER_MAXUPLOADSIZE=1024

REM Run the app and disable Streamlit's file change watcher
streamlit run signature_verification_app.py --server.maxUploadSize=1024 --server.runOnSave=false

REM Keep the window open after the app stops
pause
