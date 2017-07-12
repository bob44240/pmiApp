import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class ParticipantService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
  }

  // Function to create a new blog post
  newParticipant(part) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'parts/newParticipant', part, this.options).map(res => res.json());
  }

  // Function to get all blogs from the database
  getAllParts() {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'parts/allParticipants', this.options).map(res => res.json());
  }

  // Function to get the blog using the id
  getSingleBlog(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'blogs/singleBlog/' + id, this.options).map(res => res.json());
  }

  // Function to edit/update blog post
  editBlog(blog) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'blogs/updateBlog/', blog, this.options).map(res => res.json());
  }

  // Function to delete a blog
  deleteBlog(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.delete(this.domain + 'blogs/deleteBlog/' + id, this.options).map(res => res.json());
  }

  // Function to post a comment on a blog post
  postComment(id, comment) {
    this.createAuthenticationHeaders(); // Create headers
    // Create blogData to pass to backend
    const blogData = {
      id: id,
      comment: comment
    }
    return this.http.post(this.domain + 'blogs/comment', blogData, this.options).map(res => res.json());

  }

}
