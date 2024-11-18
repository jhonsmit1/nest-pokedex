

//clase adaptadora par usar en otro servicio



export interface httpAdapter{
    get<T>(url:string):Promise<T>;
}