declare type User = {
    id: number | undefined,
    surname: string,
    name: string,
    middleName: string | undefined,
    login: string,
    password: string,
    role: string,
}
export default User