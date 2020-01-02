import React from "react";
import { Link } from "gatsby";

class PostListing extends React.Component {
  getPostList() {
    const postList = [];
    this.props.postEdges.forEach(postEdge => {
      postList.push({
        path: postEdge.node.slug,
        tags: postEdge.node.tags,
        // cover: postEdge.node.frontmatter.cover,
        title: postEdge.node.title,
        date: postEdge.node.publishDate,
        excerpt: postEdge.node.excerpt,
        timeToRead: postEdge.node.body.childMarkdownRemark.timeToRead
      });
    });
    return postList;
  }

  render() {
    const postList = this.getPostList();
    return (
      <div>
        {/* Your post list here. */
        postList.map(post => (
          <Link to={post.path} key={post.title}>
            <h1>{post.title}</h1>
          </Link>
        ))}
      </div>
    );
  }
}

export default PostListing;
