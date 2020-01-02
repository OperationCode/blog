import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../layout";
import UserInfo from "../components/UserInfo/UserInfo";

import PostTags from "../components/PostTags/PostTags";
import SocialLinks from "../components/SocialLinks/SocialLinks";
import Footer from "../components/Footer/Footer";
import config from "../../data/SiteConfig";
import "./b16-tomorrow-dark.css";
import "./post.css";

export default class PostTemplate extends React.Component {
  render() {
    const { data, pageContext } = this.props;
    const { slug } = pageContext;
    const post = data.contentfulBlogPost;

    return (
      <Layout location={this.props.location}>
        <div style={{ background: '#fff' }}>
          <Helmet title={`${post.title} | ${config.siteTitle}`} />
          <div className="wrapper">
            <h1 className="section-headline">{post.title}</h1>
            <p
              style={{
                display: 'block',
              }}
            >
              {post.publishDate}
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html: post.body.childMarkdownRemark.html,
              }}
            />
          </div>
          <div className="post-meta">
            <PostTags tags={post.tags} />
            <SocialLinks postPath={slug} postNode={post} />
          </div>
          <UserInfo config={config} />

          <Footer config={config} />
        </div>
      </Layout>
    );
  }
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
query BlogPostBySlug($slug: String!) {
  contentfulBlogPost(slug: { eq: $slug }) {
    title
    publishDate(formatString: "MMMM Do, YYYY")
    heroImage {
      fluid(maxWidth: 1180, background: "rgb:000000") {
        ...GatsbyContentfulFluid_tracedSVG
      }
    }
    body {
      childMarkdownRemark {
        html
      }
    }
  }
}
`;
