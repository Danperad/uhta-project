declare type NewUser = {
    id: number | undefined,
    lastName: string,
    firstName: string,
    middleName: string | undefined,
    login: string,
    password: string,
    role: string,
}
export default NewUser