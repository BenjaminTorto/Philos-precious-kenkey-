import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { supabase } from '../config/supabase';

const FALLBACK_REVIEWS = [
  {
    name: 'Kofi Mensah',
    location: 'East Legon',
    comment: 'The gizzard sauce is out of this world! Perfectly spiced and the kenkey was super fresh. My new go-to spot.',
    rating: 5,
  },
  {
    name: 'Abena Serwaa',
    location: 'Osu',
    comment: 'Fast delivery and the packaging is so clean and premium. The Medium Pack is my absolute favorite.',
    rating: 5,
  },
  {
    name: 'Yaw Boateng',
    location: 'Airport Residential',
    comment: 'You can tell everything is freshly prepared. That cow leg stew (Kotodwe) is tender and delicious!',
    rating: 5,
  },
];

export default function Testimonials() {
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const [isReal, setIsReal] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false })
          .limit(6);
        if (error) throw error;

        if (data && data.length > 0) {
          setReviews(data.map(r => ({
            name: r.customer_name,
            location: 'Verified Customer',
            comment: r.comment || 'Great experience, highly recommend!',
            rating: r.rating,
          })));
          setIsReal(true);
        }
      } catch (err) {
        // Silently fall back to the written testimonials above
        console.error('Could not load live reviews:', err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="py-20 max-w-6xl mx-auto px-6 border-t border-primary/10">
      <div className="text-center mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2">Customer Love</p>
        <h2 className="font-serif text-3xl md:text-4xl">What Our Food Lovers Say</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <div key={index} className="bg-surface rounded-3xl p-8 border border-primary/10 shadow-xl flex flex-col justify-between relative">
            <div className="absolute top-6 right-6 text-primary/10">
              <Quote size={32} />
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex gap-1 text-accent">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-primary/85 leading-relaxed font-sans italic">"{review.comment}"</p>
            </div>

            <div className="border-t border-primary/10 pt-4">
              <p className="font-serif font-medium text-lg">{review.name}</p>
              <p className="text-xs text-accent uppercase tracking-wider">{review.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
