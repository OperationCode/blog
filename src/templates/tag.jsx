import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../layout";
import PostListing from "../components/PostListing/PostListing";
import config from "../../data/SiteConfig";

export default class TagTemplate extends React.Component {
  render() {
    const { tag } = this.props.pageContext;
    const postEdges = this.props.data.allContentfulBlogPost.edges;
    return (
      <Layout>
        <div className="tag-container">
          <Helmet title={`Posts tagged as "${tags}" | ${config.siteTitle}`} />
          <PostListing postEdges={postEdges} />
        </div>
      </Layout>
    );
  }
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query TagPage($tags: String) {
    allContentfulBlogPost(
      filter: { tags: {in:[$tags]} },
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
          tags
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
