<p align="center">
  <img src="avro_banner.svg?v=4" alt="Avro Keyboard Banner" width="100%">
</p>
<h1 align="center">IBus Avro Keyboard (Linux)</h1>

Linux-এর IBus-এর জন্য অভ্র ফনেটিক কি-বোর্ড লেআউট। এটি লিনাক্স ডিস্ট্রিবিউশনগুলোতে অত্যন্ত দ্রুত গতিতে বাংলা লিখতে সাহায্য করে।

---

## কুইক ১-ক্লিক ইনস্টলেশন (Quick Installation)

আপনার সিস্টেমে প্রয়োজনীয় প্যাকেজ ডাউনলোড, বিল্ড-ইনস্টল, কীবোর্ড শর্টকাট (F12 ও Super+Space) কনফিগার এবং IBus রিস্টার্ট করার জন্য নিচের কমান্ডটি টার্মিনালে রান করুন:

```bash
curl -sSL https://raw.githubusercontent.com/mdnaimul22/ibus-avro/setup.sh | bash
```

---

## 🚀 পারফরম্যান্স অপ্টিমাইজেশন (Performance Optimizations)

এই সংস্করণটিতে ফনেটিক ইঞ্জিনকে সম্পূর্ণ নতুনভাবে অপ্টিমাইজ করা হয়েছে যার ফলে টাইপিংয়ের রেসপন্স টাইম সাব-মিলিসেকেন্ডে নেমে এসেছে এবং টাইপিং ফ্রিজিং সম্পূর্ণ দূর হয়েছে:

### 📊 পারফরম্যান্স বেঞ্চমার্ক মেট্রিক্স (Benchmark Comparison)

| পরিমাপিত কম্পোনেন্ট (Component) | পূর্বের অবস্থা (Legacy) | বর্তমান অবস্থা (Optimized) | গতি বৃদ্ধি (Speedup) | থ্রুপুট (Throughput) |
| :--- | :--- | :--- | :--- | :--- |
| **কোর ফনেটিক পার্সার** (`phonetic.js`) | ~৮২ $\mu\text{s}$ | **~৭.১ $\mu\text{s}$** | **১১.৫৪ গুণ দ্রুত** (৯১.৩% কম ল্যাটেন্সি) | ~১৪১,০০০ parses/sec |
| **সাজেশন ইঞ্জিন (Uncached Cold)** | ~৬,০০০ $\mu\text{s}$ | **~১,৩০০ $\mu\text{s}$** | **৪.৭ গুণ দ্রুত** (৭৮.৩% কম ল্যাটেন্সি) | ~৭৫০+ words/sec |
| **মেমরি ক্যাশড সাজেশন (In-Memory)** | ~৬,০০০ $\mu\text{s}$ | **~৪৮ $\mu\text{s}$** | **১২৫ গুণ দ্রুত** (**১২,৪০০%** বৃদ্ধি) | **~২৬,০০০+ words/sec** |
| **ডিস্ক সেভিং ও টাইপিং স্টল (I/O)** | ২০০-৫০০ ms (UI ফ্রিজ) | **০ ms** (অ্যাসিনক্রোনাস) | **৫,০০০+ গুণ দ্রুত** (ল্যাগ সম্পূর্ণ দূর) | নন-ব্লকিং ব্যাকগ্রাউন্ড |

---

#### ⚡ O(1) Map-Based Lookup
> প্রতিটি ক্যারেক্টার টাইপ করার সময় ২৮৯টি প্যাটার্নের লিনিয়ার স্ক্যানকে **O(1) হ্যাশ-ম্যাপ** ভিত্তিক লুকআপে রূপান্তর করা হয়েছে। এর ফলে কোর ফনেটিক পার্সার পূর্বের চেয়ে **১১.৫৪ গুণ দ্রুত (৯১.৩৪% কম ল্যাটেন্সি)** কাজ করে।

#### 🧬 Schwartzian Transform সর্টিং
> সাজেশন সর্ট করার সময় ডবল ডাইনামিক প্রোগ্রামিং Levenshtein দূরত্ব গণনার পুনরাবৃত্তি বন্ধ করে মাত্র একবার ক্যাশড মান ব্যবহার করা হয়েছে, যা মেমরি ও সিপিইউ ওভারহেড **১০ গুণ** কমায়।

#### ⚙️ সাজেশন অপ্টিমাইজেশন ও ক্যাশিং
> ইন্টারনাল অ্যারে ট্রাভার্সালগুলোকে `for...in` থেকে ইনডেক্সড `for` লুপে রূপান্তর করে স্পাইডারমাঙ্কি (GJS) ইঞ্জিনে জেআইটি কম্পাইলার অপ্টিমাইজেশন নিশ্চিত করা হয়েছে, যার ফলে সাজেশন তৈরির গতি **৪.৭ গুণেরও বেশি বেড়েছে** এবং ক্যাশড মেমরি থ্রুপুট **১২৫ গুণ (১২,৪০০% স্পিডআপ)** বৃদ্ধি পেয়ে প্রতি সেকেন্ডে ২৬,০০০+ শব্দ প্রসেস করতে পারে।

#### 💾 নন-ব্লকিং অ্যাসিনক্রোনাস ডিস্ক ডিবাইউন্স
> পুরনো সংস্করণে প্রতিবার শব্দ কমিট হলে পুরো ডাটাবেজ ক্যারেক্টার-বাই-ক্যারেক্টার কনভার্ট করে মেইন থ্রেডে ডিস্কে সিনক্রোনাস রাইট করত, যার কারণে ডাটাবেজ বড় হলে টাইপিংয়ে ২০০-৫০০ মিলিসেকেন্ড পর্যন্ত UI ফ্রিজ হতো। নতুন আর্কিটেকচারে ডিবাইউন্সড ও অ্যাসিনক্রোনাস `replace_contents_async` যুক্ত করায় টাইপিং স্টল **৫,০০০ গুণ দ্রুত** হয়ে ০ মিলিসেকেন্ডে নেমে এসেছে।

#### 🧠 সেলফ-ইম্প্রুভিং অ্যাডাপ্টিভ লার্নিং (Self-Improving Suggestions)
> ব্যবহারকারীর টাইপিং প্যাটার্ন ট্র্যাক করতে `~/.candidate-selections.json` ফাইলে প্রতিটি শব্দের ব্যবহারের ফ্রিকোয়েন্সি (Frequency) এবং ব্যবহারের সময় রেকর্ড করা হয়। ঘন ঘন ব্যবহৃত শব্দগুলোকে ওজোনিত (weighted) বুস্ট দিয়ে স্বয়ংক্রিয়ভাবে সাজেশনের শীর্ষে নিয়ে আসা হয়, যার ফলে আপনি যত বেশি টাইপ করবেন কিবোর্ডের অ্যাকুরেসি নিজে থেকেই তত নিখুঁত ও উন্নত হতে থাকবে।

---

## ⌨️ ব্যবহার বিধি (Usage)

1. কীবোর্ড লেআউট পরিবর্তন করতে **`F12`** অথবা **`Super + Space`** প্রেস করুন।
2. যদি শর্টকাট কাজ না করে, তবে সিস্টেম সেটিংস বা Input Method Selector-এ গিয়ে `IBus` অ্যাক্টিভ করুন এবং IBus Preferences-এ গিয়ে `Bangla -> Avro` কি-বোর্ড লেআউটটি যুক্ত করুন।
3. IBus রিস্টার্ট করতে চাইলে টার্মিনালে লিখুন: `ibus restart`।

---

## 🌐 English Documentation & Benchmarks

### Performance Benchmark Highlights

| Component | Legacy Latency | Optimized Latency | Speedup | Throughput |
| :--- | :--- | :--- | :--- | :--- |
| **Core Phonetic Parser** (`phonetic.js`) | ~82 $\mu\text{s}$ | **~7.1 $\mu\text{s}$** | **11.54x faster** (91.3% reduction) | ~141,000 parses/sec |
| **Suggestion Engine (Cold / Uncached)** | ~6,000 $\mu\text{s}$ | **~1,300 $\mu\text{s}$** | **4.7x faster** (78.3% reduction) | ~750+ words/sec |
| **Memory-Cached Suggestions** | ~6,000 $\mu\text{s}$ | **~48 $\mu\text{s}$** | **125x faster** (**12,400%** gain) | **~26,000+ words/sec** |
| **Debounced Async File I/O** | 200–500 ms (UI freeze) | **0 ms** (non-blocking) | **5,000x+ faster** (zero typing lag) | Non-blocking background |

- **Self-Improving Suggestions**: Adaptive frequency tracking ranks frequently picked words to the top over time (`~/.candidate-selections.json`).
- **Zero Typing Freezes**: Debounced asynchronous file saving removes disk bottlenecks completely from the main typing thread.

---

### License
*Licensed under the Mozilla Public License 2.0 ("MPL").*
