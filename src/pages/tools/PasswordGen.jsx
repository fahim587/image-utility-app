import React, { useState } from "react";
import {
  Copy,
  RefreshCw,
  Key,
  ShieldCheck,
  Settings2,
  Hash,
  Type,
  AlertCircle,
  ChevronDown
} from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const PasswordGen = () => {

  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const faq = [
    {
      q: "What is a strong password?",
      a: "A strong password usually contains uppercase letters, lowercase letters, numbers and symbols with at least 12–16 characters."
    },
    {
      q: "Is this password generator secure?",
      a: "Yes. All passwords are generated locally in your browser and never stored on our server."
    },
    {
      q: "Why should I use symbols in my password?",
      a: "Symbols increase password complexity and make it harder for attackers to guess or brute-force."
    },
    {
      q: "What password length is recommended?",
      a: "Security experts recommend at least 12–16 characters for strong protection."
    }
  ];

  const generatePassword = () => {

    let charset = "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let generated = "";
    for (let i = 0; i < length; i++) {
      generated += charset[Math.floor(Math.random() * charset.length)];
    }

    setPassword(generated);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Correct Strength Logic
  const strength = length < 12 ? "Weak" : length < 20 ? "Strong" : "Ultra Secure";
  const strengthColor = length < 12 ? "bg-rose-500" : length < 20 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-2xl mb-4">
            <Key className="text-emerald-600" size={26} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Password Generator</h1>
          <p className="text-gray-500 text-sm mt-1">Create ultra-secure passwords instantly.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Settings */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-500 flex items-center gap-2 mb-2">
                <Settings2 size={14}/> Length {length}
              </label>
              <input
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e)=>setLength(parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div className="space-y-3">
              <Option icon={<Type size={16}/>} label="Uppercase Letters" checked={includeUppercase} toggle={()=>setIncludeUppercase(!includeUppercase)} />
              <Option icon={<Hash size={16}/>} label="Numbers" checked={includeNumbers} toggle={()=>setIncludeNumbers(!includeNumbers)} />
              <Option icon={<AlertCircle size={16}/>} label="Symbols" checked={includeSymbols} toggle={()=>setIncludeSymbols(!includeSymbols)} />
            </div>
          </div>

          {/* Result */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col">
            <div className="bg-emerald-50 border-2 border-dashed border-emerald-100 rounded-2xl p-6 text-center">
              <p className="text-xs text-emerald-500 font-bold mb-2 uppercase">Generated Password</p>
              <div className="font-mono text-xl font-bold text-gray-700 break-all">{password}</div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={generatePassword}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl hover:scale-105 transition"
              >
                <RefreshCw size={18}/> Generate
              </button>

              <button
                onClick={copyPassword}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
              >
                {copied ? <ShieldCheck size={18}/> : <Copy size={18}/>} {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Strength */}
            <div className="mt-6">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-gray-400">Strength</span>
                <span className={`${strengthColor} text-white px-2 rounded-full`}>{strength}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${strengthColor} transition-all`} style={{width:`${(length/64)*100}%`}} />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {faq.map((item,i)=>(
              <div key={i} className="border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden">
                <button
                  onClick={()=>setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 font-semibold text-left hover:bg-gray-50 transition"
                >
                  {item.q}
                  <ChevronDown className={`transition-transform ${openFAQ === i ? "rotate-180" : ""}`} size={18}/>
                </button>
                <div className={`transition-all duration-300 px-4 overflow-hidden text-sm text-gray-600 ${openFAQ === i ? "max-h-40 py-2" : "max-h-0"}`}>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <RelatedTools categoryId="utility"/>
        </div>
      </div>
    </div>
  );
};

const Option = ({icon,label,checked,toggle}) => (
  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
    <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">{icon}{label}</div>
    <input type="checkbox" checked={checked} onChange={toggle} className="accent-emerald-600 w-4 h-4"/>
  </label>
);

export default PasswordGen;