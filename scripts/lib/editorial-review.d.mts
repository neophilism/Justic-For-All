export type EditorialReviewState={state:"draft"|"in_review"|"approved"|"published"|"rejected"|"withdrawn";authorId:string;highRisk:boolean;approverIds:string[];version:number};
export declare function editorialTransition(current:EditorialReviewState,action:"submit"|"approve"|"revoke"|"reject"|"publish"|"withdraw",context:{actorId:string;expectedVersion:number}):EditorialReviewState;
