-- Add Indian cities with rupee-based pricing
INSERT INTO public.cities (name, country, region, latitude, longitude, cost_index, popularity_rating, description, image_url) VALUES
-- Major Tourist Destinations
('Mumbai', 'India', 'Asia', 19.0760, 72.8777, 65, 4.5, 'The financial capital of India, known for Bollywood, street food, and colonial architecture.', 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800'),
('Delhi', 'India', 'Asia', 28.6139, 77.2090, 60, 4.6, 'India''s capital city, rich in history with monuments like Red Fort and India Gate.', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800'),
('Goa', 'India', 'Asia', 15.2993, 74.1240, 55, 4.7, 'Famous for beautiful beaches, Portuguese heritage, and vibrant nightlife.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800'),
('Jaipur', 'India', 'Asia', 26.9124, 75.7873, 45, 4.4, 'The Pink City, known for magnificent palaces, forts, and Rajasthani culture.', 'https://images.unsplash.com/photo-1599661046827-dacde6976549?w=800'),
('Kerala (Kochi)', 'India', 'Asia', 9.9312, 76.2673, 50, 4.8, 'God''s Own Country - backwaters, spice plantations, and Ayurvedic treatments.', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'),
('Agra', 'India', 'Asia', 27.1767, 78.0081, 40, 4.3, 'Home to the iconic Taj Mahal, one of the Seven Wonders of the World.', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'),
('Varanasi', 'India', 'Asia', 25.3176, 82.9739, 35, 4.2, 'One of the oldest cities in the world, spiritual capital on the banks of Ganges.', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800'),
('Udaipur', 'India', 'Asia', 24.5854, 73.7125, 55, 4.5, 'The City of Lakes, known for stunning palaces and romantic architecture.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'),
('Rishikesh', 'India', 'Asia', 30.0869, 78.2676, 30, 4.1, 'Yoga capital of the world, adventure sports, and spiritual retreats.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'),
('Hampi', 'India', 'Asia', 15.3350, 76.4600, 25, 4.0, 'UNESCO World Heritage site with ancient ruins and boulder landscapes.', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800');

-- Add activities for Mumbai (costs in rupees)
INSERT INTO public.activities (city_id, name, description, category, estimated_cost, duration_hours, rating) VALUES
((SELECT id FROM public.cities WHERE name = 'Mumbai'), 'Gateway of India Visit', 'Iconic monument and symbol of Mumbai, great for photos and history', 'sightseeing', 0, 1.5, 4.2),
((SELECT id FROM public.cities WHERE name = 'Mumbai'), 'Marine Drive Walk', 'Scenic promenade along the Arabian Sea, perfect for sunset views', 'relaxation', 0, 2, 4.5),
((SELECT id FROM public.cities WHERE name = 'Mumbai'), 'Bollywood Studio Tour', 'Behind-the-scenes tour of film studios and sets', 'culture', 1500, 4, 4.3),
((SELECT id FROM public.cities WHERE name = 'Mumbai'), 'Street Food Tour', 'Taste authentic Mumbai street food like vada pav, bhel puri', 'food', 800, 3, 4.7),
((SELECT id FROM public.cities WHERE name = 'Mumbai'), 'Elephanta Caves Trip', 'Ancient rock-cut caves dedicated to Lord Shiva (includes ferry)', 'culture', 600, 6, 4.1),
((SELECT id FROM public.cities WHERE name = 'Mumbai'), 'Crawford Market Shopping', 'Bustling market for spices, fruits, and local goods', 'shopping', 500, 2, 4.0);

-- Add activities for Delhi (costs in rupees)
INSERT INTO public.activities (city_id, name, description, category, estimated_cost, duration_hours, rating) VALUES
((SELECT id FROM public.cities WHERE name = 'Delhi'), 'Red Fort Tour', 'Magnificent Mughal fortress and UNESCO World Heritage site', 'sightseeing', 50, 2, 4.4),
((SELECT id FROM public.cities WHERE name = 'Delhi'), 'India Gate Visit', 'War memorial and popular picnic spot', 'sightseeing', 0, 1, 4.3),
((SELECT id FROM public.cities WHERE name = 'Delhi'), 'Chandni Chowk Food Walk', 'Explore Old Delhi''s famous food street and markets', 'food', 600, 3, 4.6),
((SELECT id FROM public.cities WHERE name = 'Delhi'), 'Humayun''s Tomb', 'Beautiful Mughal architecture and garden tomb', 'culture', 40, 1.5, 4.2),
((SELECT id FROM public.cities WHERE name = 'Delhi'), 'Lotus Temple Visit', 'Modern architectural marvel and Bahai House of Worship', 'culture', 0, 1, 4.1),
((SELECT id FROM public.cities WHERE name = 'Delhi'), 'Connaught Place Shopping', 'Central shopping district with restaurants and shops', 'shopping', 1000, 3, 4.0),
((SELECT id FROM public.cities WHERE name = 'Delhi'), 'Rickshaw Ride in Old Delhi', 'Traditional cycle rickshaw tour through narrow lanes', 'adventure', 300, 2, 4.5);

-- Add activities for Goa (costs in rupees)
INSERT INTO public.activities (city_id, name, description, category, estimated_cost, duration_hours, rating) VALUES
((SELECT id FROM public.cities WHERE name = 'Goa'), 'Beach Day at Baga', 'Relax on famous Baga Beach with water sports options', 'relaxation', 500, 4, 4.4),
((SELECT id FROM public.cities WHERE name = 'Goa'), 'Dudhsagar Waterfall Trek', 'Trek to spectacular four-tiered waterfall', 'adventure', 2000, 8, 4.6),
((SELECT id FROM public.cities WHERE name = 'Goa'), 'Old Goa Churches Tour', 'Visit historic Portuguese churches and cathedrals', 'culture', 100, 3, 4.2),
((SELECT id FROM public.cities WHERE name = 'Goa'), 'Spice Plantation Visit', 'Tour organic spice farms with traditional lunch', 'nature', 800, 4, 4.3),
((SELECT id FROM public.cities WHERE name = 'Goa'), 'Sunset Cruise', 'Romantic boat cruise along Mandovi River', 'relaxation', 1200, 2, 4.5),
((SELECT id FROM public.cities WHERE name = 'Goa'), 'Night Market Shopping', 'Browse local handicrafts and souvenirs at Anjuna Flea Market', 'shopping', 1000, 3, 4.1),
((SELECT id FROM public.cities WHERE name = 'Goa'), 'Goan Cuisine Cooking Class', 'Learn to cook authentic Goan dishes', 'food', 1500, 4, 4.4);

-- Add activities for Jaipur (costs in rupees)
INSERT INTO public.activities (city_id, name, description, category, estimated_cost, duration_hours, rating) VALUES
((SELECT id FROM public.cities WHERE name = 'Jaipur'), 'Amber Fort Visit', 'Majestic hilltop fort with elephant rides available', 'sightseeing', 200, 3, 4.6),
((SELECT id FROM public.cities WHERE name = 'Jaipur'), 'City Palace Tour', 'Royal palace complex with museums and courtyards', 'culture', 300, 2, 4.4),
((SELECT id FROM public.cities WHERE name = 'Jaipur'), 'Hawa Mahal Photo Stop', 'Iconic Palace of Winds with intricate lattice work', 'sightseeing', 50, 0.5, 4.2),
((SELECT id FROM public.cities WHERE name = 'Jaipur'), 'Johari Bazaar Shopping', 'Famous market for jewelry, textiles, and handicrafts', 'shopping', 2000, 3, 4.3),
((SELECT id FROM public.cities WHERE name = 'Jaipur'), 'Rajasthani Folk Dance Show', 'Traditional cultural performance with dinner', 'culture', 1000, 3, 4.5),
((SELECT id FROM public.cities WHERE name = 'Jaipur'), 'Hot Air Balloon Ride', 'Aerial view of Pink City and surrounding landscape', 'adventure', 8000, 3, 4.7);

-- Add activities for Kerala (costs in rupees)
INSERT INTO public.activities (city_id, name, description, category, estimated_cost, duration_hours, rating) VALUES
((SELECT id FROM public.cities WHERE name = 'Kerala (Kochi)'), 'Backwater Houseboat Cruise', 'Overnight stay on traditional Kerala houseboat', 'relaxation', 6000, 24, 4.8),
((SELECT id FROM public.cities WHERE name = 'Kerala (Kochi)'), 'Kathakali Dance Performance', 'Traditional Kerala classical dance drama', 'culture', 300, 2, 4.4),
((SELECT id FROM public.cities WHERE name = 'Kerala (Kochi)'), 'Ayurvedic Spa Treatment', 'Authentic Kerala massage and wellness therapy', 'relaxation', 2000, 2, 4.6),
((SELECT id FROM public.cities WHERE name = 'Kerala (Kochi)'), 'Tea Plantation Tour', 'Visit Munnar tea gardens with tasting session', 'nature', 1500, 6, 4.5),
((SELECT id FROM public.cities WHERE name = 'Kerala (Kochi)'), 'Chinese Fishing Nets Experience', 'Watch traditional fishing methods at Fort Kochi', 'culture', 100, 1, 4.1),
((SELECT id FROM public.cities WHERE name = 'Kerala (Kochi)'), 'Kerala Cooking Class', 'Learn to prepare traditional Kerala dishes with coconut', 'food', 1200, 4, 4.3);

-- Add activities for Agra (costs in rupees)
INSERT INTO public.activities (city_id, name, description, category, estimated_cost, duration_hours, rating) VALUES
((SELECT id FROM public.cities WHERE name = 'Agra'), 'Taj Mahal Sunrise Visit', 'Experience the Taj Mahal at sunrise with fewer crowds', 'sightseeing', 1100, 3, 4.9),
((SELECT id FROM public.cities WHERE name = 'Agra'), 'Agra Fort Exploration', 'Massive red sandstone fort with Mughal architecture', 'culture', 650, 2, 4.3),
((SELECT id FROM public.cities WHERE name = 'Agra'), 'Mehtab Bagh Sunset View', 'Garden complex with perfect Taj Mahal sunset views', 'sightseeing', 300, 1.5, 4.4),
((SELECT id FROM public.cities WHERE name = 'Agra'), 'Marble Inlay Workshop', 'Learn traditional marble craftsmanship techniques', 'culture', 800, 2, 4.2),
((SELECT id FROM public.cities WHERE name = 'Agra'), 'Mughlai Food Tour', 'Taste authentic Mughal cuisine at local restaurants', 'food', 1000, 3, 4.5);

-- Add activities for Varanasi (costs in rupees)
INSERT INTO public.activities (city_id, name, description, category, estimated_cost, duration_hours, rating) VALUES
((SELECT id FROM public.cities WHERE name = 'Varanasi'), 'Ganges Sunrise Boat Ride', 'Spiritual boat ride during sunrise with ghats view', 'culture', 500, 2, 4.7),
((SELECT id FROM public.cities WHERE name = 'Varanasi'), 'Evening Ganga Aarti', 'Witness the grand evening prayer ceremony', 'culture', 0, 1.5, 4.8),
((SELECT id FROM public.cities WHERE name = 'Varanasi'), 'Walking Tour of Old City', 'Explore narrow lanes, temples, and local life', 'sightseeing', 400, 3, 4.3),
((SELECT id FROM public.cities WHERE name = 'Varanasi'), 'Sarnath Buddhist Site', 'Visit where Buddha gave his first sermon', 'culture', 200, 3, 4.2),
((SELECT id FROM public.cities WHERE name = 'Varanasi'), 'Banarasi Silk Shopping', 'Shop for famous Varanasi silk sarees and fabrics', 'shopping', 3000, 2, 4.1);

-- Add activities for Udaipur (costs in rupees)
INSERT INTO public.activities (city_id, name, description, category, estimated_cost, duration_hours, rating) VALUES
((SELECT id FROM public.cities WHERE name = 'Udaipur'), 'City Palace Complex', 'Magnificent palace overlooking Lake Pichola', 'sightseeing', 300, 3, 4.5),
((SELECT id FROM public.cities WHERE name = 'Udaipur'), 'Lake Pichola Boat Ride', 'Romantic boat ride with palace views', 'relaxation', 400, 1.5, 4.6),
((SELECT id FROM public.cities WHERE name = 'Udaipur'), 'Jagdish Temple Visit', 'Beautiful Indo-Aryan temple dedicated to Lord Vishnu', 'culture', 0, 1, 4.2),
((SELECT id FROM public.cities WHERE name = 'Udaipur'), 'Saheliyon Ki Bari', 'Garden of Maidens with fountains and lotus pools', 'nature', 30, 1, 4.1),
((SELECT id FROM public.cities WHERE name = 'Udaipur'), 'Rajasthani Miniature Painting Class', 'Learn traditional Rajasthani art techniques', 'culture', 1500, 3, 4.4);

-- Add activities for Rishikesh (costs in rupees)
INSERT INTO public.activities (city_id, name, description, category, estimated_cost, duration_hours, rating) VALUES
((SELECT id FROM public.cities WHERE name = 'Rishikesh'), 'White Water Rafting', 'Thrilling rafting experience on the Ganges', 'adventure', 1500, 4, 4.6),
((SELECT id FROM public.cities WHERE name = 'Rishikesh'), 'Yoga Class at Ashram', 'Authentic yoga session with experienced teachers', 'relaxation', 500, 2, 4.5),
((SELECT id FROM public.cities WHERE name = 'Rishikesh'), 'Bungee Jumping', 'India''s highest bungee jumping experience', 'adventure', 3500, 1, 4.7),
((SELECT id FROM public.cities WHERE name = 'Rishikesh'), 'Ganga Aarti at Parmarth Niketan', 'Evening prayer ceremony by the holy river', 'culture', 0, 1, 4.4),
((SELECT id FROM public.cities WHERE name = 'Rishikesh'), 'Trek to Neer Garh Waterfall', 'Short trek to beautiful waterfall for swimming', 'nature', 200, 3, 4.2),
((SELECT id FROM public.cities WHERE name = 'Rishikesh'), 'Ayurvedic Massage', 'Traditional healing massage therapy', 'relaxation', 1200, 1.5, 4.3);

-- Add activities for Hampi (costs in rupees)
INSERT INTO public.activities (city_id, name, description, category, estimated_cost, duration_hours, rating) VALUES
((SELECT id FROM public.cities WHERE name = 'Hampi'), 'Virupaksha Temple Visit', 'Ancient temple dedicated to Lord Shiva', 'culture', 30, 1, 4.3),
((SELECT id FROM public.cities WHERE name = 'Hampi'), 'Hampi Ruins Bicycle Tour', 'Explore ancient Vijayanagara Empire ruins by bike', 'sightseeing', 300, 4, 4.5),
((SELECT id FROM public.cities WHERE name = 'Hampi'), 'Sunset at Hemakuta Hill', 'Panoramic sunset views over boulder landscape', 'nature', 0, 1.5, 4.6),
((SELECT id FROM public.cities WHERE name = 'Hampi'), 'Coracle Ride on Tungabhadra', 'Traditional round boat ride across the river', 'adventure', 150, 0.5, 4.2),
((SELECT id FROM public.cities WHERE name = 'Hampi'), 'Stone Chariot Photography', 'Visit the iconic stone chariot at Vittala Temple', 'sightseeing', 40, 1, 4.4),
((SELECT id FROM public.cities WHERE name = 'Hampi'), 'Rock Climbing', 'Boulder climbing in unique granite landscape', 'adventure', 2000, 4, 4.1);