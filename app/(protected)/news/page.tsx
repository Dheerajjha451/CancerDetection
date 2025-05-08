"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Article {
  title: string;
  url: string;
  urlToImage: string;
  description: string;
}

const News: React.FC = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;


  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const [brainTumorResponse, lungCancerResponse, healthResponse] = await Promise.all([
          axios.get(`https://newsapi.org/v2/everything?q="brain%20tumor"&apiKey=${API_KEY}&pageSize=12&page=${pageNumber}`),
          axios.get(`https://newsapi.org/v2/everything?q="lung%20cancer"&apiKey=${API_KEY}&pageSize=12&page=${pageNumber}`),
          axios.get(`https://newsapi.org/v2/everything?q="Chest%20cancer"&apiKey=${API_KEY}&pageSize=12&page=${pageNumber}`)
        ]);

        const newArticles = [
          ...brainTumorResponse.data.articles,
          ...lungCancerResponse.data.articles,
          ...healthResponse.data.articles,
        ] as Article[];

        setNews((prevNews) => [...prevNews, ...newArticles]);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    if (API_KEY) {
      fetchNews();
    } else {
      console.error("API key not found");
    }
  }, [API_KEY, pageNumber]);

  const handleLoadMore = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  return (
   

      <div className=" overflow-y-scroll h-full p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
         News
        </h2>

        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-2">
            {news.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-4 cursor-pointer transition duration-300 transform hover:scale-105"
                onClick={() => window.open(article.url, "_blank")}
              >
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="rounded-t-lg w-full h-40 object-cover mb-4"
                  />
                )}
                <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600">{article.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No news available</p>
        )}
        
        {loading && <p>Loading...</p>}
        
        {!loading && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Load More
            </button>
          </div>
        )}
      </div>
  );
};

export default News;