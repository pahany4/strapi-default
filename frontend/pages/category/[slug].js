import Articles from "../../components/articles"
import {fetchAPI} from "../../lib/api"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import store from "../../reducers";
import {Provider} from "react-redux";

const Category = ({category, categories}) => {
    const seo = {
        metaTitle: category.attributes.name,
        metaDescription: `All ${category.attributes.name} articles`,
    }

    return (
        <Provider store={store}>
            <Layout categories={categories.data}>
                <Seo seo={seo}/>
                <div className="uk-section">
                    <div className="uk-container uk-container-large">
                        <h1>{category.attributes.name}</h1>
                        <Articles articles={category.attributes.articles.data}/>
                    </div>
                </div>
            </Layout>
        </Provider>
    )
}

export async function getStaticPaths() {
    const categoriesRes = await fetchAPI("/categories", {fields: ["slug"]})

    return {
        paths: categoriesRes.data.map((category) => ({
            params: {
                slug: category.attributes.slug,
            },
        })),
        fallback: false,
    }
}

export async function getStaticProps({params}) {
    const matchingCategories = await fetchAPI("/categories", {
        filters: {slug: params.slug},
        populate: {
            articles: {
                populate: "*",
            },
        },
    })
    const allCategories = await fetchAPI("/categories")

    return {
        props: {
            category: matchingCategories.data[0],
            categories: allCategories,
        },
        revalidate: 1,
    }
}

export default Category
