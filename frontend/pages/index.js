import React from "react"
import Articles from "../components/articles"
import Layout from "../components/layout"
import Seo from "../components/seo"
import {fetchAPI} from "../lib/api"
import store from '../reducers/index'
import {Provider} from "react-redux";

const Home = ({articles, categories, homepage}) => {
    return (
        <Provider store={store}>
            <Layout categories={categories}>
                <Seo seo={homepage.attributes.seo}/>
                <div className="uk-section">
                    <div className="uk-container uk-container-large">
                        <h1>{homepage.attributes.hero.title}</h1>
                        <Articles articles={articles}/>
                    </div>
                </div>
            </Layout>
        </Provider>
    )
}

export async function getStaticProps() {
    // Run API calls in parallel
    const [articlesRes, categoriesRes, homepageRes] = await Promise.all([
        fetchAPI("/articles", {populate: "*"}),
        fetchAPI("/categories", {populate: "*"}),
        fetchAPI("/homepage", {
            populate: {
                hero: "*",
                seo: {populate: "*"},
            },
        }),
    ])

    return {
        props: {
            articles: articlesRes.data,
            categories: categoriesRes.data,
            homepage: homepageRes.data,
        },
        revalidate: 1,
    }
}

export default Home
