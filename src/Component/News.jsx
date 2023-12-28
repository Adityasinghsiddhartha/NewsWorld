import React, {useEffect, useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from "prop-types"
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  //document.title = `${capitalizeFirstLetter(props.category)} - News App`;
  
 const  capitalizeFirstLetter = (string)=> {
    return string.charAt(0).toUpperCase()+ string.slice(1);
  }
  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=9bc614535d9240eaa29137d4643bf747&page=${page}&pageSize=${props.pageSize}`;
    // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=36ba8621e6384c8ba1f9ef540ba63d4e&page=1&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(60);
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100);
  }
  
  useEffect(() => {
    updateNews();
  }, [])
  
  // const handleNextClick = async () => {
  //   setPage(page+1)
  //   updateNews();
  // }
  // const handlePrevClick = async () => {
  //   setPage(page-1)
  //   updateNews();
  // }

  const fetchMoreData = async ()=> {
    
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=9bc614535d9240eaa29137d4643bf747&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1)
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
  };

 
    return (
      <>
        <h1 className='text-center' style={{ margin: "30px 0px",  marginTop: "90px"}}>NewsWorld - Top {capitalizeFirstLetter(props.category)} News Headlines</h1>
        {loading && <Spinner />}
        
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner/>}
          
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <div className="container">
          <div className="row">
            {articles.map((element) => {
              return <div className='col-md-4' key={element.url}>
                <NewsItem title={element.title} description={element.description ? element.description.slice(0, 60) : ""} imageUrl={element.urlToImage} newsUrl={element.url}
                  author={element.author} date={element.publishedAt} />
              </div>
            })}

          </div>
          </div>
        </InfiniteScroll>
</>

    )
  }


News.defaultProps = {
  country: 'in',
  pageSize: 9
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string
}

export default News
