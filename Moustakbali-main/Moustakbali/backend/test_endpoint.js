import axios from 'axios';

async function test() {
  try {
    console.log('Testing backend endpoint...');
    const res = await axios.post('http://localhost:5000/api/finance-ai', {
      message: "Comment investir 5000 DH au Maroc ?",
      history: []
    }, { timeout: 30000 });
    console.log('✅ Success! Model used:', res.data.model);
    console.log('Reply preview:', res.data.reply?.slice(0, 200));
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
}

test();
