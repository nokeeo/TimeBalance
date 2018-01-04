declare module "*.handlebars" {
  declare function template(context: any, options?: any): string;
  export default template;
}
