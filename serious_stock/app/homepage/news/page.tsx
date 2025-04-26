/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { config } from "@/app/config";
import LoadingPage from "@/utility/loading";
import { fetchApi } from "@/utility/useApi";
import { useEffect, useState , createContext} from "react";
import { NewsCard } from "../home/newSection";
import NewsModal from "./newsDetail";

interface sourceProps {
  name: string;
}

interface itemProps {
  urlToImage: string;
  publishedAt: string;
  description: string;
  title: string;
  author: string;
  source: sourceProps;
  name: string;
  url: string;
  content: string;
  category: string;
}
export const DataContexts = createContext<any>(undefined);

export default function Page() {
  const [news, setNews] = useState<itemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await fetchApi(config.apiGetNews);
        if (res) {
          const sorted = res.articles.sort((a: any, b: any) =>
            b.publishedAt.localeCompare(a.publishedAt)
          );
          setNews(sorted);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingPage />;

  const totalPages = Math.ceil(news.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedNew = news.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i
              ? "bg-blue-500 text-white font-bold"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <DataContexts.Provider
          value={{ isOpen, setIsOpen, selectedNews, setSelectedNews }}
        >
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedNew.map((item: itemProps, index) => (
          <NewsCard
            key={index}
            title={item.title}
            author={item.author}
            date={item.publishedAt}
            image={item.urlToImage}
            category={item.source.name}
            description={item.description}
            url={item.url}
            content={item.content}
            setIsOpen={setIsOpen}
              setSelectedNews={setSelectedNews}
          />
        ))}
      </div>
        <NewsModal isOpen={isOpen} setIsOpen={setIsOpen} selectedNews={selectedNews}/>
      {/* Page Number Pagination with Arrows */}
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        <button
          onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          ‹
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          ›
        </button>
      </div>
    </div>
    </DataContexts.Provider>
  );
}
