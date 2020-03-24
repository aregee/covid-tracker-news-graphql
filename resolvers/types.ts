import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Country = {
   __typename?: 'Country';
  name?: Maybe<Scalars['String']>;
  results?: Maybe<Array<Maybe<Result>>>;
  mostRecent?: Maybe<Result>;
};

export type DateInput = {
  eq?: Maybe<Scalars['String']>;
  gt?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
};

export type HelplineNumber = {
   __typename?: 'HelplineNumber';
  country?: Maybe<Country>;
  state?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['String']>;
};

export type NewsArticle = {
   __typename?: 'NewsArticle';
  country?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  short?: Maybe<Scalars['String']>;
  headline?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  urlToImage?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type NewsArticleDateArgs = {
  format?: Maybe<Scalars['String']>;
};

export type Query = {
   __typename?: 'Query';
  results?: Maybe<Array<Maybe<Result>>>;
  result?: Maybe<Result>;
  summary?: Maybe<Summary>;
  countries?: Maybe<Array<Maybe<Country>>>;
  country?: Maybe<Country>;
  states?: Maybe<Array<Maybe<State>>>;
  state?: Maybe<State>;
  news?: Maybe<Array<Maybe<NewsArticle>>>;
  referedlink?: Maybe<Array<Maybe<ReferedLink>>>;
  helpline?: Maybe<Array<Maybe<HelplineNumber>>>;
  labs?: Maybe<Array<Maybe<TestSite>>>;
};


export type QueryResultsArgs = {
  countries?: Maybe<Array<Maybe<Scalars['String']>>>;
  date?: Maybe<DateInput>;
};


export type QueryResultArgs = {
  country: Scalars['String'];
  date?: Maybe<Scalars['String']>;
};


export type QuerySummaryArgs = {
  countries?: Maybe<Array<Maybe<Scalars['String']>>>;
  date?: Maybe<DateInput>;
};


export type QueryCountriesArgs = {
  names?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type QueryCountryArgs = {
  name?: Maybe<Scalars['String']>;
};


export type QueryStatesArgs = {
  country: Scalars['String'];
  names?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type QueryStateArgs = {
  country: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};


export type QueryNewsArgs = {
  country: Scalars['String'];
  format?: Maybe<Scalars['String']>;
};


export type QueryReferedlinkArgs = {
  country: Scalars['String'];
  state?: Maybe<Scalars['String']>;
};


export type QueryHelplineArgs = {
  country: Scalars['String'];
  state?: Maybe<Scalars['String']>;
};


export type QueryLabsArgs = {
  country: Scalars['String'];
  state?: Maybe<Scalars['String']>;
};

export type ReferedLink = {
   __typename?: 'ReferedLink';
  source?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
};

export type Result = {
   __typename?: 'Result';
  country?: Maybe<Country>;
  state?: Maybe<State>;
  date?: Maybe<Scalars['String']>;
  confirmed?: Maybe<Scalars['Int']>;
  deaths?: Maybe<Scalars['Int']>;
  recovered?: Maybe<Scalars['Int']>;
  growthRate?: Maybe<Scalars['Float']>;
};


export type ResultDateArgs = {
  format?: Maybe<Scalars['String']>;
};

export type State = {
   __typename?: 'State';
  name?: Maybe<Scalars['String']>;
  results?: Maybe<Array<Maybe<Result>>>;
  mostRecent?: Maybe<Result>;
};

export type Summary = {
   __typename?: 'Summary';
  date?: Maybe<Scalars['String']>;
  confirmed?: Maybe<Scalars['Int']>;
  deaths?: Maybe<Scalars['Int']>;
  recovered?: Maybe<Scalars['Int']>;
};


export type SummaryDateArgs = {
  format?: Maybe<Scalars['String']>;
};

export type TestSite = {
   __typename?: 'TestSite';
  country?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  site?: Maybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  String: ResolverTypeWrapper<Scalars['String']>,
  DateInput: DateInput,
  Result: ResolverTypeWrapper<Result>,
  Country: ResolverTypeWrapper<Country>,
  State: ResolverTypeWrapper<State>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  Float: ResolverTypeWrapper<Scalars['Float']>,
  Summary: ResolverTypeWrapper<Summary>,
  NewsArticle: ResolverTypeWrapper<NewsArticle>,
  ReferedLink: ResolverTypeWrapper<ReferedLink>,
  HelplineNumber: ResolverTypeWrapper<HelplineNumber>,
  TestSite: ResolverTypeWrapper<TestSite>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  String: Scalars['String'],
  DateInput: DateInput,
  Result: Result,
  Country: Country,
  State: State,
  Int: Scalars['Int'],
  Float: Scalars['Float'],
  Summary: Summary,
  NewsArticle: NewsArticle,
  ReferedLink: ReferedLink,
  HelplineNumber: HelplineNumber,
  TestSite: TestSite,
  Boolean: Scalars['Boolean'],
};

export type CountryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Country'] = ResolversParentTypes['Country']> = {
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  results?: Resolver<Maybe<Array<Maybe<ResolversTypes['Result']>>>, ParentType, ContextType>,
  mostRecent?: Resolver<Maybe<ResolversTypes['Result']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type HelplineNumberResolvers<ContextType = any, ParentType extends ResolversParentTypes['HelplineNumber'] = ResolversParentTypes['HelplineNumber']> = {
  country?: Resolver<Maybe<ResolversTypes['Country']>, ParentType, ContextType>,
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type NewsArticleResolvers<ContextType = any, ParentType extends ResolversParentTypes['NewsArticle'] = ResolversParentTypes['NewsArticle']> = {
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  short?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  headline?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  urlToImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  results?: Resolver<Maybe<Array<Maybe<ResolversTypes['Result']>>>, ParentType, ContextType, RequireFields<QueryResultsArgs, never>>,
  result?: Resolver<Maybe<ResolversTypes['Result']>, ParentType, ContextType, RequireFields<QueryResultArgs, 'country'>>,
  summary?: Resolver<Maybe<ResolversTypes['Summary']>, ParentType, ContextType, RequireFields<QuerySummaryArgs, never>>,
  countries?: Resolver<Maybe<Array<Maybe<ResolversTypes['Country']>>>, ParentType, ContextType, RequireFields<QueryCountriesArgs, never>>,
  country?: Resolver<Maybe<ResolversTypes['Country']>, ParentType, ContextType, RequireFields<QueryCountryArgs, never>>,
  states?: Resolver<Maybe<Array<Maybe<ResolversTypes['State']>>>, ParentType, ContextType, RequireFields<QueryStatesArgs, 'country'>>,
  state?: Resolver<Maybe<ResolversTypes['State']>, ParentType, ContextType, RequireFields<QueryStateArgs, 'country'>>,
  news?: Resolver<Maybe<Array<Maybe<ResolversTypes['NewsArticle']>>>, ParentType, ContextType, RequireFields<QueryNewsArgs, never>>,
  referedlink?: Resolver<Maybe<Array<Maybe<ResolversTypes['ReferedLink']>>>, ParentType, ContextType, RequireFields<QueryReferedlinkArgs, 'country'>>,
  helpline?: Resolver<Maybe<Array<Maybe<ResolversTypes['HelplineNumber']>>>, ParentType, ContextType, RequireFields<QueryHelplineArgs, 'country'>>,
  labs?: Resolver<Maybe<Array<Maybe<ResolversTypes['TestSite']>>>, ParentType, ContextType, RequireFields<QueryLabsArgs, 'country'>>,
};

export type ReferedLinkResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReferedLink'] = ResolversParentTypes['ReferedLink']> = {
  source?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['Result'] = ResolversParentTypes['Result']> = {
  country?: Resolver<Maybe<ResolversTypes['Country']>, ParentType, ContextType>,
  state?: Resolver<Maybe<ResolversTypes['State']>, ParentType, ContextType>,
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<ResultDateArgs, never>>,
  confirmed?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  deaths?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  recovered?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  growthRate?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type StateResolvers<ContextType = any, ParentType extends ResolversParentTypes['State'] = ResolversParentTypes['State']> = {
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  results?: Resolver<Maybe<Array<Maybe<ResolversTypes['Result']>>>, ParentType, ContextType>,
  mostRecent?: Resolver<Maybe<ResolversTypes['Result']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type SummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Summary'] = ResolversParentTypes['Summary']> = {
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<SummaryDateArgs, never>>,
  confirmed?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  deaths?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  recovered?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type TestSiteResolvers<ContextType = any, ParentType extends ResolversParentTypes['TestSite'] = ResolversParentTypes['TestSite']> = {
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  site?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type Resolvers<ContextType = any> = {
  Country?: CountryResolvers<ContextType>,
  HelplineNumber?: HelplineNumberResolvers<ContextType>,
  NewsArticle?: NewsArticleResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  ReferedLink?: ReferedLinkResolvers<ContextType>,
  Result?: ResultResolvers<ContextType>,
  State?: StateResolvers<ContextType>,
  Summary?: SummaryResolvers<ContextType>,
  TestSite?: TestSiteResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
