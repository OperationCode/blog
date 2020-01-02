/* eslint "no-console": "off" */

const path = require("path");
const _ = require("lodash");
const moment = require("moment");
const siteConfig = require("./data/SiteConfig");

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const postPage = path.resolve("src/templates/post.jsx");
  const tagPage = path.resolve("src/templates/tag.jsx");
  const categoryPage = path.resolve("src/templates/category.jsx");
  const listingPage = path.resolve("./src/templates/listing.jsx");

  // Get a full list of markdown posts
  const blogQueryResult = await graphql(`
    {
      allContentfulBlogPost {
        edges {
          node {
            author {
              name
              github
              email
            }
            publishDate(formatString: "MMMM Do, YYYY")
            slug
            description {
              description
            }
            tags
            title
            category
            body {
              childMarkdownRemark {
                timeToRead
              }
            }
          }
        }
      }
    }
  `);

  if (blogQueryResult.errors) {
    console.error(blogQueryResult.errors);
    throw blogQueryResult.errors;
  }

  const tagSet = new Set();
  const categorySet = new Set();

  const postsEdges = blogQueryResult.data.allContentfulBlogPost.edges;

  // Sort posts
  postsEdges.sort((postA, postB) => {
    const dateA = moment(
      postA.node.publishDate,
      siteConfig.dateFromFormat
    );

    const dateB = moment(
      postB.node.publishDate,
      siteConfig.dateFromFormat
    );

    if (dateA.isBefore(dateB)) return 1;
    if (dateB.isBefore(dateA)) return -1;

    return 0;
  });

  // Paging
  const { postsPerPage } = siteConfig;
  const pageCount = Math.ceil(postsEdges.length / postsPerPage);

  [...Array(pageCount)].forEach((_val, pageNum) => {
    createPage({
      path: pageNum === 0 ? `/` : `/${pageNum + 1}/`,
      component: listingPage,
      context: {
        limit: postsPerPage,
        skip: pageNum * postsPerPage,
        pageCount,
        currentPageNum: pageNum + 1
      }
    });
  });

  // Post page creating
  postsEdges.forEach((edge, index) => {
    // Generate a list of tags
    if (edge.node.tags) {
      edge.node.tags.forEach(tag => {
        tagSet.add(tag);
      });
    }

    // Generate a list of categories
    if (edge.node.category) {
      categorySet.add(edge.node.category);
    }

    // Create post pages
    const nextID = index + 1 < postsEdges.length ? index + 1 : 0;
    const prevID = index - 1 >= 0 ? index - 1 : postsEdges.length - 1;
    const nextEdge = postsEdges[nextID];
    const prevEdge = postsEdges[prevID];

    createPage({
      path: edge.node.slug,
      component: postPage,
      context: {
        slug: edge.node.slug,
        nexttitle: nextEdge.node.title,
        nextslug: nextEdge.node.slug,
        prevtitle: prevEdge.node.title,
        prevslug: prevEdge.node.slug
      }
    });
  });

  //  Create tag pages
  tagSet.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag)}/`,
      component: tagPage,
      context: { tag }
    });
  });

  // Create category pages
  categorySet.forEach(category => {
    createPage({
      path: `/categories/${_.kebabCase(category)}/`,
      component: categoryPage,
      context: { category }
    });
  });
};
