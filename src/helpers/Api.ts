import ApolloClient from 'apollo-client'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import { HttpLink } from 'apollo-link-http'
import Axios, { AxiosInstance } from 'axios'
import { ApolloLink, concat, Operation, NextLink, Observable } from 'apollo-link'

export class Api {
  private _baseUrl: string
  private _restEndpoint: string
  private _graphqlEndpoint: string
  private _graphqlClient: VueApollo
  private _apolloClient: ApolloClient<NormalizedCacheObject>
  private _restClient: AxiosInstance
  private _jwtToken: string = ''

  public get BaseUrl() {
    return this._baseUrl
  }

  public get RestEndpoint() {
    return this._restEndpoint
  }

  public get GraphqlEndpoint() {
    return this._graphqlEndpoint
  }

  public get RestUri() {
    return this.getUri(this.RestEndpoint)
  }

  public get GraphqlUri() {
    return this.getUri(this.GraphqlEndpoint)
  }

  public get GraphqlClient() {
    return this._graphqlClient
  }

  public get RestClient() {
    return this._restClient
  }

  public get JwtToken() {
    return this._jwtToken
  }
  public set JwtToken(val: string) {
    this._jwtToken = val

    // Set the REST Authorization header
    this._restClient.defaults.headers = {
      ...this._restClient.defaults.headers,
      Authorization: this.HeaderAuthorization
    }
  }

  public get HeaderAuthorization(): (null | string) {
    if (this._jwtToken) {
      return `Bearer ${this.JwtToken}`
    }
    return null
  }

  public constructor(baseUrl: string, restEndpoint: string, graphqlEndpoint: string) {
    this._baseUrl = baseUrl
    this._restEndpoint = restEndpoint
    this._graphqlEndpoint = graphqlEndpoint

    // Bind to set the context to this
    const apolloLink = new ApolloLink(this.authMiddleware.bind(this))
    const httpLink = new HttpLink({ uri: this.GraphqlUri })

    // Link include the middleware with concat
    this._apolloClient = new ApolloClient({
      link: concat(apolloLink, httpLink),
      cache: new InMemoryCache(),
      connectToDevTools: true,
    })

    this._graphqlClient = new VueApollo({
      defaultClient: this._apolloClient
    })

    this._restClient = Axios.create({
      baseURL: this.RestUri
    })
  }

  private getUri(endpoint: string) {
    return `${this.BaseUrl}/${endpoint}`
  }

  /**
   * Set the header with the JWT Token
   */
  private authMiddleware(operation: Operation, forward?: NextLink): Observable<any> | null {
    operation.setContext({
      headers: {
        Authorization: this.HeaderAuthorization
      }
    })
    if (forward) {
      return forward(operation)
    }
    return null
  }
}
