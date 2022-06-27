import VueRouter from 'vue-router'
import accountList from "../components/accountList";
import statistic from "../components/statistic";

export default new VueRouter({
    mode:'hash',
    routes:[
        {
            path:'/',
            redirect:'homepage',
            
        },{
            path:'/homepage',
            component:accountList
            
        },
        {
            path:'/statistic',
            component:statistic
        },
        
    ]
})