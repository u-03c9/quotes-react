import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

interface QuoteInterface {
  title: string;
  id: string;
  description: string;
  extract: string;
  extract_html: string;
  image: {
    source: string;
    width: number;
    height: number;
  };
  content_urls: {
    desktop: string;
    mobile: string;
  };
}

const fetchQuoteApi = async (): Promise<QuoteInterface> => {
  return axios
    .get("https://en.wikiquote.org/api/rest_v1/page/random/summary")
    .then((res) => {
      const { originalimage, tid, ...rest } = res.data;
      return { image: originalimage, id: tid, ...rest };
    })
    .catch((error) => console.error(error));
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [quotes, setQuotes] = useState<QuoteInterface[]>([]);

  const fetchQuote = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const newQuote = await fetchQuoteApi();
    setQuotes([...quotes, newQuote]);
    setIsLoading(false);
  };

  const handleClick = async () => {
    await fetchQuote();
  };

  useEffect(() => {
    fetchQuote().then(() => setIsLoading(false));
  }, []);

  return (
    <>
      <button onClick={handleClick}>fetch new quote</button>
      <div>
        {quotes.map((quote) => (
          <div key={quote.id}>{quote.title}</div>
        ))}
      </div>
    </>
  );
}

export default App;
