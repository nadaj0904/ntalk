import PyPDF2

def extract_text(pdf_path, txt_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        with open(txt_path, 'w', encoding='utf-8') as out:
            out.write(text)

extract_text('src/main/resources/static/md/WiseT Agent 사용자 가이드 v1.8.3_r1.pdf', 'agent_user_guide.txt')
extract_text('src/main/resources/static/md/WiseT Agent 설치가이드 v1.8.3_r1.pdf', 'agent_install_guide.txt')
print("Done")
