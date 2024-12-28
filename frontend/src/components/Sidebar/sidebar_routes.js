import article_logo from '../../assets/icons/article.svg'
import hackathon_logo from '../../assets/icons/hackathon.svg'
import dashboard_logo from '../../assets/icons/dashboard.svg'
import chat_logo from '../../assets/icons/chats.svg'
import profile_logo from '../../assets/icons/profile.svg'
import help_logo from '../../assets/icons/help.svg'

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        icon: dashboard_logo
    },
    {
        path: '/profile',
        name: 'My Profile',
        icon: profile_logo
    },
    {
        path: '/hackathons',
        name: 'Hackathons',
        icon: hackathon_logo
    },
    {
        path: '/articles',
        name: 'Articles',
        icon: article_logo
    },
    {
        path: '/messages',
        name: 'Chats',
        icon: chat_logo
    },
    {
        path: '/help',
        name: 'Help',
        icon: help_logo
    },
]

export default routes