import './users.json';

export default function user(id){
    return users.find(u => u.id === id);
}