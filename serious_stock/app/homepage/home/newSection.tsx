/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect  } from "react";
import { Calendar, Clock, User } from "lucide-react";
import { fetchApi } from "@/utility/useApi";
import { config } from "@/app/config";
import LoadingPage from "@/utility/loading";
import { useRouter } from "next/navigation";
import NewsModal from "../news/newsDetail";



interface NewsCardProps {
  title: string;
  author: string;
  date: string;
  image: string;
  category: string;
  description: string;
  url: string;
  content: string;
  setIsOpen: (isOpen: boolean) => void;
  setSelectedNews: (selectedNews: any) => void;
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

interface sourceProps {
  name: string;
}



export const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState({});

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
        console.log("News");
        console.log(news);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  const handleToAllNews = () => {
    router.push("/homepage/news");
  };

  return (
    
      <div className="flex flex-col mt-10 mb-16">
        <div className="flex items-center justify-between mb-6 border-b ">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Investment News
            </h2>
          </div>
          <div>
            <h2
              className="text-blue-500  cursor-pointer"
              onClick={handleToAllNews}
            >
              See all
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {news.slice(0, 4).map((item: itemProps, index) => (
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
        <NewsModal isOpen={isOpen} setIsOpen={setIsOpen} selectedNews={selectedNews} />
      </div>
  
  );
};

export const NewsCard = (prop : NewsCardProps) => {
  
  const {
    title,
    author,
    date,
    image,
    category,
    description,
    url,
    content,
    setIsOpen, 
    setSelectedNews
  } = prop;
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time to be more readable
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleOpenModal = () => {
    setSelectedNews({
      title,
      author,
      date,
      image,
      category,
      description,
      url,
      content,
    });

    setIsOpen(true);
  };

  return (
    <div
      className="flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
      onClick={handleOpenModal}
    >
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute top-3 right-3 bg-red-400 text-white text-xs font-medium px-2 py-1 rounded">
          {category}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-800">
          {title}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <User className="w-3 h-3 mr-1" />
          <span>{author}</span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{formatTime(date)}</span>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};
