import { Link } from 'react-router';
import { Heart, Dumbbell, Apple, Scale, ChevronRight, ArrowRight, BarChart2, Broccoli, Map} from 'lucide-react';

const features = [
    {
        icon: Dumbbell,
        title: 'Workout Tracking',
        body: "Log every sessions - weights, reps, cardio, or custom routines. See your training history at a glance and understand what's working",
    },
    {
        icon: Apple,
        title: "Nutrition Awareness",
        body: "Track what you eat. My Health Online helps you stay aware of your calorie balance so you can make informed choices.",
    },
    {
        icon: Broccoli,
        title: "Healthy Recipe Options",
        body: "Access all our free recipes to help you stay on track for your fitness goals. Cook with ease knowing exactly what you need and how it fits into your goals.",
    },
    {
        icon: Map,
        title: "Find Locations Near You",
        body: "We will help you look for nearby gyms, or stores to make your shopping that much easier and remove the headache of hours of searching."
    },
    {
        icon: Scale,
        title: "Weight Goals",
        body: " Set a goal weight and track your progress over time. We will show you your current trends to help you monitor your progress."
    },
    {
        icon: BarChart2,
        title: "Progress Over time",
        body: "Charts and summaries that show the bigger picture. Whether is muscle gains, weight trends, or workout frequency."
    },
];

export default function Landing() {
    return (
        <div className='min-h-screen page-bg-light text-black'>
            {/* Hero */}
            <section className='max-w-5xl mx-auto px-6 pt-20 pb-16 text-center'>
                <div className='inline-flex items-center gap-2 page-background-light border border-[#d0daf0] text-color-primary text-xs font-medium px-3 py-1.5 rounded-full mb-8'>
                    <span className='w-1.5 h-1.5 rounded-full bg-[#4d7cba]' />
                    Now in early access
                </div>

                <h1
                    className='text-5xl md-text-6xl font-medium leading-[1.1] mb-6 max-w-3xl mx-auto'
                >
                    Your health, {" "}
                    <em className='text-color-primary not-italic'>simplified</em>
                </h1>

                <p className='text-lg text-black max-w-xl mx-auto leading-relaxed mb-10'>
                    My Health Online brings your workouts, nutrition, and weight goals into one calm,
                    focused space — so you can spend less time managing data and more time
                    actually feeling better.
                </p>
                <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
                    <Link
                        to='/signUp'
                        className='flex items-center gap-2 bg-color-primary text-white text-sm font-medium px-6 py-3.5 rounded-xl hover-bg-color-primary
                                   active:scale-[0.99] transition-all'
                    >
                        Start For Free
                        <ArrowRight className='w-4 h-4' />
                    </Link>
                    <Link
                        to='/login'
                        className='flex items-center gap-1.5 text-sm text-black/50 hover:text-[#2d4e7a] transition-colors px-4 py-3.5'
                    >
                        Already Have an account
                        <ChevronRight className='w-4 h-4' />
                    </Link>
                </div>
            </section>

            {/* Divider */}
            <div className='max-w-5xl mx-auto px-6'>
                <div className='h-px bg-gradient-to-r from-transparent via-[#b8cee8] to-transparent' />
            </div>

            {/* What is My Health Online */}
            <section className='max-w-5xl mx-auto px-6 py-20'>
                <div className='grid md:grid-cols-2 gap-12 items-center'>
                    <div>
                        <p className='text-xs font-medium tracking-[0.15em] uppercase text-color-primary mb-4'>
                            What is My Health Online
                        </p>
                        <h2 className='text-3xl md:text-4xl font-medium leading-tight mb-5'
                        >
                            The one stop help companion for all your needs.
                        </h2>
                        <p className='text-black/55 leading-relaxed mb-4'>
                            Most health apps offer you one service, wether its counting calories,
                            workout trackers, etc. The goal of My Health Online is to be your
                            one stop shop to all your health tracking, goals, and needs.
                        </p>
                        <p className='text-black leading-relaxed'>
                            By combining all your apps into one, and providing important resources
                            like local grocery store's and gyms in your area it makes your journey 
                            effortless. My Health Online shows you in one place everything you are
                            doing, and how to fix your lifestyle if something goes wrong, or why 
                            everything is going right.
                        </p>
                    </div>

                    {/* Visual Block */}
                    <div className='grid grid-cols-2 gap-3'>
                        {[
                            { label: "Track Workouts", sub: "Log sets, reps and sessions", color: "#e8f2ff", accent: "#7cb4f0"},
                            { label: "Monitor Nutrition", sub: "Stay aware of what you eat", color: "#ddeeff", accent: "#6b9fd4"},
                            { label: "Set Weight Goals", sub: "Track your trend over time", color: "#e4eefb", accent: "#4d7cba"},
                            { label: "Build Consistency", sub: "Understand your habits", color: "#edf4ff", accent: "#8ab3e0"},
                        ].map((item) => (
                            <div
                                key={item.label}
                                className='rounded-xl p-4 border border-white/70 shadow-[0_2px_12px_rgba(0,0,0,0.4)]'
                                style={{ background: item.color }}
                            >   
                                <div className='w-2 h-2 rounded-full mb-3' style={{ background: item.accent }} />
                                <div className='text-sm font-medium text-black mb-1'>{item.label}</div>
                                <div className='text-xs text-black/45 leading-snug'>{item.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className='max-w-5xl mx-auto px-6'>
                <div className='h-px bg-gradient-to-r from-transparent via-[#b8cee8] to-transparent' />
            </div>

            {/* Features */}
            <section className='max-w-5xl mx-auto px-6 py-20'>
                <div className='text-center mb-14'>
                    <p className='text-xs font-medium tracking-[0.15rem] uppercase text-color-primary mb-4'>
                        What My Health Online Helps With
                    </p>
                    <h2
                        className='text-3xl md:text-4xl font-medium leading-tight max-w-lg mx-auto'>
                            Everything you need, nothing you don&apos;t
                    </h2>
                </div>

                <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-5'>
                    {features.map((f) => {
                        const Icon = f.icon;
                        return (
                            <div
                                key={f.title}
                                className='bg-white/60 backdrop-blur-sm border border-white/80 rounded-xl p-6 hover:bg-white/80 transition-colors duration-200'
                            >
                                <div className='w-9 h-9 rounded-lg bg-[#e4eefb] flex items-center justify-center mb-4'>
                                    <Icon className='w-4.5 h-4.5 text-color-primary' strokeWidth={1.75} />
                                </div>
                                <h3 className='text-sm font-semibold text-black mb-2'>{f.title}</h3>
                                <p className='text-sm text-black/50 leading-relaxed'>{f.body}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Divider */}
            <div className='max-w-5xl mx-auto px-6'>
                <div className='h-px bg-gradient-to-r from-transparent via-[#b8cee8] to-transparent' />
            </div>
            
            {/* CTA */}
            <section className='max-w-5xl mx-auto px-6 py-20 text-center'>
                <div className='bg-[#1e5fa8] rounded-2xl px-8 py-14'>
                    <h2 className='text-3xl md:text-4xl font-medium text-white leading-tight mb-4'>
                        Ready to reach your goals?
                    </h2>
                    <p className='text-white/55 max-5-sm mx-auto mb-8 text-sm leading-relaxed'>
                        Join My Health Online today for free. No card, no commitmment.
                    </p>
                    <Link
                        to='/signUp'
                        className='inline-flex items-center gap-2 bg-white text-[#1e5fa8] text-sm font-semibold px-6 py-3.5 rounded-xl hober:bg-[#f0f5ff] 
                                   active:scale-[0.99] transition-all'>
                        Create your free account
                        <ArrowRight className='w-4 h-4' />
                    </Link>
                </div>
            </section>
        </div>
        
    )
}