// App.js
import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [email, setEmail] = useState([]);

  function handleMsg(evt) {
    setMsg(evt.target.value);
  }

  function handleMail(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = workbook.Sheets[sheetName];
      const emails = XLSX.utils.sheet_to_json(sheetData, { header: "A" }).map((item) => item.A);
      setEmail(emails);
      console.log(emails);
    };

    reader.readAsBinaryString(file);
  }

  function send() {
    setStatus(true);
    axios
      .post("https://bulk-mail-backend-3sxz.onrender.com/sendmail", { msg, email })
      .then((data) => {
        if (data.data === true) {
          alert("Email sent successfully");
        } else {
          alert("Email failed");
        }
        setStatus(false);
      })
      .catch(() => {
        alert("Error sending email");
        setStatus(false);
      });
  }

  return (
    <div className="bg-gradient-to-b from-black to-gray-900 min-h-screen flex flex-col items-center justify-center">
      <header className="text-white text-center">
        <h1 className="font-bold text-5xl mb-4">Bulk Mail</h1>
        <p className="text-xl font-light mb-10 text-gray-300">
          We can help your business with sending emails at once
        </p>
      </header>

      <main className="flex flex-col items-center w-full px-4">
        <textarea
          onChange={handleMsg}
          value={msg}
          className="h-32 w-full max-w-3xl p-4 rounded-lg bg-black 
            border border-gray-600 text-white placeholder-gray-400 text-lg 
            outline-none focus:ring-4 focus:ring-white transition-all mb-6"
          placeholder="Enter your message..."
        ></textarea>

        <div className="flex flex-col items-center space-y-4">
          <input
            onChange={handleMail}
            type="file"
            className="block w-full max-w-xs text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-100 file:text-black
                hover:file:bg-gray-200 transition-all"
          />
          <p className="text-white text-lg">Total Emails in the file: {email.length}</p>

          <button
            onClick={send}
            className="px-6 py-3 text-lg font-semibold text-black bg-white rounded-lg 
                shadow-md hover:shadow-2xl hover:bg-gray-200 transition-all duration-300 
                transform hover:-translate-y-1 active:translate-y-0"
          >
            {status ? "Sending..." : "Send"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
