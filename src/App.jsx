import './App.css'
import {useRef, useState} from "react";
import {generateText} from "../api.js";
import { useReactToPrint } from "react-to-print";


function App() {
    const [text, setText] = useState("");
    const [url, setUrl] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [brailleText, setBrailleText] = useState("");
    const printRef = useRef();
    const brailleMap = {
        'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
        'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
        'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
        'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
        'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵',
        ' ': ' ', ',': '⠂', '.': '⠲', '?': '⠦', '!': '⠖',
        '\'': '⠄', '’': '⠄', '‘': '⠄', '-': '⠤', ':': '⠱', ';': '⠆',
        'ch': '⠡', 'sh': '⠩', 'g‘': '⠣', 'o‘': '⠷', 'ng': '⠻'
    };

    function toBraille(text) {
        const lowered = text.toLowerCase();
        let result = '';
        let i = 0;

        while (i < lowered.length) {
            const next3 = lowered.slice(i, i + 3);
            const next2 = lowered.slice(i, i + 2);
            const next1 = lowered[i];

            if (brailleMap[next3]) {
                result += brailleMap[next3];
                i += 3;
            } else if (brailleMap[next2]) {
                result += brailleMap[next2];
                i += 2;
            } else if (brailleMap[next1]) {
                result += brailleMap[next1];
                i += 1;
            } else {
                result += '?';
                i += 1;
            }
        }

        return result;
    }

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    const handleChange = (e) => {
        setText(e.target.value);
        setBrailleText(toBraille(e.target.value));
    };
    const chopEtish = () => {
        window.print(brailleText);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        generateText(JSON.stringify({text}))
            .then(res => {
                setUrl(URL.createObjectURL(res.data));
            })
            .catch(err => console.log(err));
    }

    return (
    <div className="container pt-5">
        <h2 className="text-center pb-5">Ko‘zi ojizlar uchun Braille Word fayl yaratish</h2>
        {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
        <div className="row">
            <div className="col rounded">
                <form onSubmit={handleSubmit} className="form mb-3">
                    <div className="mb-3">
                        <label htmlFor="text" className="form-label">Matn kiriting:</label>
                        <textarea className="form-control" id="text" name="text" value={text} placeholder="Matnni kiriting..." onChange={handleChange}></textarea>
                    </div>
                    <div className="mb-3">
                        <input type="submit" className="btn btn-primary" value="Yuborish" />
                    </div>
                </form>
            </div>
            <div className="col rounded row">
                <div className="col-12 row">
                    <div className="col-12 pb-5" id="print-area">
                        <h6 className="col-12">Braille matn</h6>
                        <p className="border rounded text-break" id="brailleParagraph">{brailleText}</p>
                    </div>
                    <div className="col-12 row gap-3">
                        <button className="col-4 btn btn-outline-secondary" onClick={()=> window.print()}>Chop etish</button>
                        {url && (
                            <a href={`${url}`} className="btn btn-link col-4" download="braille.docx">Yuklab olish (.docx)</a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default App
