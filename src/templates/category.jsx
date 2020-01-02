import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../layout";
import PostListing from "../components/PostListing/PostListing";
import config from "../../data/SiteConfig";

export default class CategoryTemplate extends React.Component {
  render() {
    const { category } = this.props.pageContext;
    const postEdges = this.props.data.allContentfulBlogPost.edges;
    return (
      <Layout>
        <div className="category-container">
          <Helmet
            title={`Posts in category "${category}" | ${config.siteTitle}`}
          />
          <PostListing postEdges={postEdges} />
        </div>
      </Layout>
    );
  }
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query CategoryPage($category: String) {
    allContentfulBlogPost(
      filter: { category: {in:[$category]} },
      sort: {fields: publishDate, order: DESC},
      limit: 150,
    ) {
      edges {
        node {
          author {
            name
          }
          category
          publishDate(formatString: "MMMM Do, YYYY")
          slug
          title
          body {
            childMarkdownRemark {
              timeToRead
          }
        }
      }
    }
  }
  }
`;
