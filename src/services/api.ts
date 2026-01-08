import { Book, ReadingList, Review, Recommendation } from '@/types';
import { mockBooks, mockReadingLists } from './mockData';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * ============================================================================
 * API SERVICE LAYER - BACKEND COMMUNICATION
 * ============================================================================
 *
 * ⚠️ IMPORTANT: This file currently uses MOCK DATA for all API calls.
 *
 * TO IMPLEMENT AWS BACKEND:
 * Follow the step-by-step guide in IMPLEMENTATION_GUIDE.md
 *
 * Quick Reference:
 * - Week 2: Implement Books API (getBooks, getBook, createBook, etc.)
 * - Week 2: Implement Reading Lists API
 * - Week 3: Add Cognito authentication headers
 * - Week 4: Implement AI recommendations with Bedrock
 *
 * ============================================================================
 * IMPLEMENTATION CHECKLIST:
 * ============================================================================
 *
 * [ ] Week 1: Set up AWS account and first Lambda function
 * [ ] Week 2: Create DynamoDB tables (Books, ReadingLists)
 * [ ] Week 2: Deploy Lambda functions for Books API
 * [ ] Week 2: Deploy Lambda functions for Reading Lists API
 * [ ] Week 2: Set VITE_API_BASE_URL in .env file
 * [ ] Week 3: Set up Cognito User Pool
 * [ ] Week 3: Install aws-amplify: npm install aws-amplify
 * [ ] Week 3: Configure Amplify in src/main.tsx
 * [ ] Week 3: Update AuthContext with Cognito functions
 * [ ] Week 3: Implement getAuthHeaders() function below
 * [ ] Week 3: Add Cognito authorizer to API Gateway
 * [ ] Week 4: Deploy Bedrock recommendations Lambda
 * [ ] Week 4: Update getRecommendations() function
 * [ ] Week 4: Remove all mock data returns
 * [ ] Week 4: Delete src/services/mockData.ts
 *
 * ============================================================================
 */

// API Gateway URL - connected to your Lambda functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Get authentication headers with JWT token from Cognito
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
    return {
      'Content-Type': 'application/json'
    };
  } catch {
    return {
      'Content-Type': 'application/json'
    };
  }
}

/**
 * Get all books from the catalog with caching
 */
let booksCache: { data: Book[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getBooks(): Promise<Book[]> {
  // Check if we have valid cached data
  if (booksCache && Date.now() - booksCache.timestamp < CACHE_DURATION) {
    console.log('📦 Using cached books data');
    return booksCache.data;
  }

  try {
    console.log('🌐 Fetching books from API');
    const response = await fetch(`${API_BASE_URL}/books`);
    if (!response.ok) throw new Error('Failed to fetch books');
    const data = await response.json();
    const books = data.books || [];
    
    // Cache the response
    booksCache = {
      data: books,
      timestamp: Date.now()
    };
    
    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    // Return cached data if available, otherwise fallback to mock
    if (booksCache) {
      console.log('⚠️ API failed, using cached data');
      return booksCache.data;
    }
    // Fallback to mock data if API fails and no cache
    console.log('📚 Using mock data with updated book');
    return mockBooks;
  }
}

/**
 * Get a single book by ID
 *
 * TODO: Replace with real API call in Week 2, Day 3-4
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-get-book (see IMPLEMENTATION_GUIDE.md)
 * 2. Create API Gateway endpoint: GET /books/{id}
 * 3. Replace mock code below with:
 *
 * const response = await fetch(`${API_BASE_URL}/books/${id}`);
 * if (response.status === 404) return null;
 * if (!response.ok) throw new Error('Failed to fetch book');
 * return response.json();
 *
 * Expected response: Single Book object or null if not found
 */
export async function getBook(id: string): Promise<Book | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to fetch book');
    const data = await response.json();
    return data.book || null;
  } catch (error) {
    console.error('Error fetching book:', error);
    // Fallback to mock data if API fails
    const book = mockBooks.find((b) => b.id === id);
    return book || null;
  }
}

/**
 * Create a new book (admin only)
 *
 * TODO: Replace with real API call in Week 2, Day 5-7
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-create-book
 * 2. Create API Gateway endpoint: POST /books
 * 3. Add Cognito authorizer (Week 3)
 * 4. Replace mock code below with:
 *
 * const headers = await getAuthHeaders();
 * const response = await fetch(`${API_BASE_URL}/books`, {
 *   method: 'POST',
 *   headers,
 *   body: JSON.stringify(book)
 * });
 * if (!response.ok) throw new Error('Failed to create book');
 * return response.json();
 *
 * Note: This endpoint requires admin role in Cognito
 */
export async function createBook(book: Omit<Book, 'id'>): Promise<Book> {
  // TODO: Remove this mock implementation after deploying Lambda
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBook: Book = {
        ...book,
        id: Date.now().toString(),
      };
      resolve(newBook);
    }, 500);
  });
}

/**
 * Update an existing book (admin only)
 * TODO: Replace with PUT /books/:id API call
 */
export async function updateBook(id: string, book: Partial<Book>): Promise<Book> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingBook = mockBooks.find((b) => b.id === id);
      const updatedBook: Book = {
        ...existingBook!,
        ...book,
        id,
      };
      resolve(updatedBook);
    }, 500);
  });
}

/**
 * Delete a book (admin only)
 * TODO: Replace with DELETE /books/:id API call
 */
export async function deleteBook(): Promise<void> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 300);
  });
}

/**
 * Get AI-powered book recommendations using Amazon Bedrock
 */
export async function getRecommendations(query: string): Promise<Recommendation[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get recommendations: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    // Transform the AI response to match our Recommendation type
    if (data.recommendations && Array.isArray(data.recommendations)) {
      const transformedRecs = data.recommendations.map((rec: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        bookId: `ai-book-${index}`,
        reason: rec.reason || 'AI-powered recommendation',
        confidence: rec.confidence || 0.8,
        aiBook: {
          title: rec.title,
          author: rec.author,
          reason: rec.reason
        }
      }));
      
      return transformedRecs;
    }
    
    return [];
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    // Fallback to mock data if API fails
    return generateMockAIRecommendations(query);
  }
}

/**
 * Generate realistic mock AI recommendations based on user query
 */
function generateMockAIRecommendations(query: string): Promise<Recommendation[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const queryLower = query.toLowerCase();
      let recommendations: Recommendation[] = [];

      // More sophisticated query analysis with multiple keywords
      const isMysteryCrime = queryLower.includes('mystery') || queryLower.includes('thriller') || 
                            queryLower.includes('detective') || queryLower.includes('crime') || 
                            queryLower.includes('murder') || queryLower.includes('suspense') ||
                            queryLower.includes('investigation') || queryLower.includes('noir');

      const isSciFi = queryLower.includes('science fiction') || queryLower.includes('sci-fi') || 
                     queryLower.includes('space') || queryLower.includes('alien') || 
                     queryLower.includes('future') || queryLower.includes('technology') ||
                     queryLower.includes('robot') || queryLower.includes('cyberpunk') ||
                     queryLower.includes('dystopian') || queryLower.includes('time travel');

      const isRomance = queryLower.includes('romance') || queryLower.includes('love') || 
                       queryLower.includes('relationship') || queryLower.includes('dating') ||
                       queryLower.includes('romantic') || queryLower.includes('heart') ||
                       queryLower.includes('passion') || queryLower.includes('wedding');

      const isSelfHelp = queryLower.includes('productivity') || queryLower.includes('self-help') || 
                        queryLower.includes('development') || queryLower.includes('success') ||
                        queryLower.includes('habits') || queryLower.includes('motivation') ||
                        queryLower.includes('business') || queryLower.includes('leadership') ||
                        queryLower.includes('mindset') || queryLower.includes('growth');

      const isFantasy = queryLower.includes('fantasy') || queryLower.includes('magic') || 
                       queryLower.includes('dragon') || queryLower.includes('wizard') ||
                       queryLower.includes('medieval') || queryLower.includes('quest') ||
                       queryLower.includes('kingdom') || queryLower.includes('epic');

      const isHorror = queryLower.includes('horror') || queryLower.includes('scary') || 
                      queryLower.includes('ghost') || queryLower.includes('vampire') ||
                      queryLower.includes('zombie') || queryLower.includes('supernatural') ||
                      queryLower.includes('dark') || queryLower.includes('creepy');

      // Additional categories for future expansion
      // const isHistorical = queryLower.includes('historical') || queryLower.includes('history') || 
      //                     queryLower.includes('war') || queryLower.includes('ancient') ||
      //                     queryLower.includes('victorian') || queryLower.includes('medieval') ||
      //                     queryLower.includes('period') || queryLower.includes('past');

      // const isBiography = queryLower.includes('biography') || queryLower.includes('memoir') || 
      //                    queryLower.includes('autobiography') || queryLower.includes('life story') ||
      //                    queryLower.includes('true story') || queryLower.includes('real life');

      const isPerfume = queryLower.includes('perfume') || queryLower.includes('fragrance') || 
                       queryLower.includes('scent') || queryLower.includes('smell') ||
                       queryLower.includes('aroma') || queryLower.includes('cologne') ||
                       queryLower.includes('essential oil') || queryLower.includes('aromatherapy');

      const isSports = queryLower.includes('football') || queryLower.includes('soccer') || 
                      queryLower.includes('basketball') || queryLower.includes('tennis') ||
                      queryLower.includes('training') || queryLower.includes('fitness') ||
                      queryLower.includes('exercise') || queryLower.includes('workout') ||
                      queryLower.includes('sports') || queryLower.includes('athlete') ||
                      queryLower.includes('coaching') || queryLower.includes('nutrition');

      // const isCooking = queryLower.includes('cooking') || queryLower.includes('recipe') || 
      //                  queryLower.includes('chef') || queryLower.includes('food') ||
      //                  queryLower.includes('baking') || queryLower.includes('cuisine') ||
      //                  queryLower.includes('culinary') || queryLower.includes('kitchen');

      // const isTravel = queryLower.includes('travel') || queryLower.includes('journey') || 
      //                 queryLower.includes('adventure') || queryLower.includes('explore') ||
      //                 queryLower.includes('vacation') || queryLower.includes('trip') ||
      //                 queryLower.includes('guide') || queryLower.includes('destination');

      // const isArt = queryLower.includes('art') || queryLower.includes('painting') || 
      //              queryLower.includes('drawing') || queryLower.includes('design') ||
      //              queryLower.includes('creative') || queryLower.includes('artist') ||
      //              queryLower.includes('photography') || queryLower.includes('sculpture');

      // const isMusic = queryLower.includes('music') || queryLower.includes('musician') || 
      //                queryLower.includes('instrument') || queryLower.includes('song') ||
      //                queryLower.includes('band') || queryLower.includes('guitar') ||
      //                queryLower.includes('piano') || queryLower.includes('singing');

      // Check for specific preferences
      const wantsFemaleProtagonist = queryLower.includes('female protagonist') || 
                                    queryLower.includes('strong woman') || 
                                    queryLower.includes('female lead') ||
                                    queryLower.includes('women') || 
                                    queryLower.includes('girl');

      // const wantsYoungAdult = queryLower.includes('young adult') || queryLower.includes('ya') || 
      //                        queryLower.includes('teen') || queryLower.includes('teenager') ||
      //                        queryLower.includes('coming of age');

      // Generate recommendations based on detected themes
      if (isMysteryCrime) {
        console.log('🔍 Detected mystery/crime query');
        recommendations = [
          {
            id: 'ai-1',
            bookId: 'ai-mystery-1',
            reason: wantsFemaleProtagonist ? 
              'Perfect match! This psychological thriller features Detective Sarah Chen, a brilliant investigator who uses unconventional methods to solve complex cases. The story combines sharp character development with intricate plotting.' :
              'A masterfully crafted mystery that keeps you guessing. This psychological thriller features complex characters, red herrings, and a shocking twist that recontextualizes everything you thought you knew.',
            confidence: 0.94,
            aiBook: {
              title: wantsFemaleProtagonist ? 'The Detective\'s Gambit' : 'The Vanishing Hour',
              author: wantsFemaleProtagonist ? 'Catherine Blake' : 'Marcus Stone',
              reason: 'Gripping mystery with psychological depth'
            }
          },
          {
            id: 'ai-2',
            bookId: 'ai-mystery-2',
            reason: 'This Nordic noir combines atmospheric setting with intricate plotting. Set in the frozen landscapes of Iceland, it explores dark family secrets and the psychology of guilt.',
            confidence: 0.89,
            aiBook: {
              title: 'Frozen Secrets',
              author: 'Lars Andersen',
              reason: 'Atmospheric Nordic mystery with complex plot'
            }
          },
          {
            id: 'ai-3',
            bookId: 'ai-mystery-3',
            reason: 'A classic locked-room mystery with modern sensibilities. Features brilliant deduction, memorable characters, and pays homage to golden age detective fiction while feeling completely contemporary.',
            confidence: 0.87,
            aiBook: {
              title: 'The Locked Library Murder',
              author: 'Eleanor Hartwell',
              reason: 'Classic mystery style with modern twists'
            }
          }
        ];
      } else if (isSciFi) {
        console.log('🚀 Detected sci-fi query');
        recommendations = [
          {
            id: 'ai-1',
            bookId: 'ai-scifi-1',
            reason: 'An epic space opera that combines hard science with compelling characters. Perfect for fans of realistic space exploration, first contact scenarios, and the wonder of discovering new worlds.',
            confidence: 0.92,
            aiBook: {
              title: 'The Proxima Signal',
              author: 'Dr. Maria Santos',
              reason: 'Hard science fiction with realistic space exploration'
            }
          },
          {
            id: 'ai-2',
            bookId: 'ai-scifi-2',
            reason: queryLower.includes('ai') || queryLower.includes('artificial intelligence') ?
              'This cyberpunk thriller explores AI consciousness and the nature of sentience. It asks profound questions about what makes us human while delivering edge-of-your-seat action.' :
              'A cyberpunk thriller that explores virtual reality and digital consciousness with stunning technical detail and philosophical depth.',
            confidence: 0.88,
            aiBook: {
              title: queryLower.includes('ai') ? 'The Consciousness Code' : 'Neural Networks',
              author: 'Alex Chen',
              reason: 'Cutting-edge AI and cyberpunk themes'
            }
          },
          {
            id: 'ai-3',
            bookId: 'ai-scifi-3',
            reason: 'A time travel adventure that handles paradoxes cleverly while delivering emotional character development. It explores how small changes can have massive consequences.',
            confidence: 0.85,
            aiBook: {
              title: 'Temporal Echoes',
              author: 'Rebecca Torres',
              reason: 'Intelligent time travel with emotional depth'
            }
          }
        ];
      } else if (isRomance) {
        console.log('💕 Detected romance query');
        recommendations = [
          {
            id: 'ai-1',
            bookId: 'ai-romance-1',
            reason: 'A heartwarming contemporary romance with witty dialogue and realistic relationship development. The chemistry between the leads is electric, and you\'ll find yourself rooting for them from page one.',
            confidence: 0.91,
            aiBook: {
              title: 'Coffee Shop Chronicles',
              author: 'Sophie Williams',
              reason: 'Contemporary romance with authentic relationships'
            }
          },
          {
            id: 'ai-2',
            bookId: 'ai-romance-2',
            reason: queryLower.includes('historical') ?
              'This Regency romance combines period authenticity with passionate storytelling. Features a strong-willed heroine and a brooding hero with secrets.' :
              'This historical romance combines period authenticity with passionate storytelling, featuring strong characters and beautiful prose.',
            confidence: 0.86,
            aiBook: {
              title: 'Letters from Regency',
              author: 'Victoria Ashford',
              reason: 'Historical romance with rich period detail'
            }
          },
          {
            id: 'ai-3',
            bookId: 'ai-romance-3',
            reason: 'A second-chance romance that explores themes of forgiveness and growth. The emotional journey is beautifully written, with characters who feel real and relatable.',
            confidence: 0.83,
            aiBook: {
              title: 'Coming Home',
              author: 'Jennifer Martinez',
              reason: 'Second-chance romance with emotional growth'
            }
          }
        ];
      } else if (isSelfHelp) {
        console.log('📈 Detected self-help/productivity query');
        recommendations = [
          {
            id: 'ai-1',
            bookId: 'ai-selfhelp-1',
            reason: 'A science-based approach to productivity that combines neuroscience research with practical techniques. Every strategy is backed by research and can be implemented immediately.',
            confidence: 0.93,
            aiBook: {
              title: 'The Focused Mind',
              author: 'Dr. James Peterson',
              reason: 'Science-backed productivity strategies'
            }
          },
          {
            id: 'ai-2',
            bookId: 'ai-selfhelp-2',
            reason: queryLower.includes('habits') ?
              'This book revolutionizes how we think about habit formation. It provides a clear framework for building lasting positive changes in your life.' :
              'This book offers a fresh perspective on personal development, focusing on sustainable habits and long-term behavioral change.',
            confidence: 0.89,
            aiBook: {
              title: queryLower.includes('habits') ? 'The Habit Revolution' : 'Sustainable Success',
              author: 'Lisa Chang',
              reason: 'Sustainable approach to personal development'
            }
          },
          {
            id: 'ai-3',
            bookId: 'ai-selfhelp-3',
            reason: 'A practical guide to time management that goes beyond typical advice. It offers systems thinking and holistic life design principles.',
            confidence: 0.84,
            aiBook: {
              title: 'Time Architect',
              author: 'Michael Roberts',
              reason: 'Holistic approach to time management'
            }
          }
        ];
      } else if (isFantasy) {
        console.log('🐉 Detected fantasy query');
        recommendations = [
          {
            id: 'ai-1',
            bookId: 'ai-fantasy-1',
            reason: 'An epic fantasy with a richly detailed world, complex magic system, and characters who grow throughout their journey. Perfect for fans of high fantasy adventures.',
            confidence: 0.90,
            aiBook: {
              title: 'The Dragonkeeper\'s Crown',
              author: 'Lyra Moonwhisper',
              reason: 'Epic fantasy with rich world-building'
            }
          },
          {
            id: 'ai-2',
            bookId: 'ai-fantasy-2',
            reason: 'Urban fantasy that brings magic into the modern world. Features a strong protagonist navigating both magical and mundane challenges in contemporary settings.',
            confidence: 0.87,
            aiBook: {
              title: 'City of Shadows',
              author: 'Morgan Blackthorne',
              reason: 'Urban fantasy with modern magical elements'
            }
          },
          {
            id: 'ai-3',
            bookId: 'ai-fantasy-3',
            reason: 'A dark fantasy that explores moral ambiguity and the cost of power. The magic comes with a price, and heroes must make difficult choices.',
            confidence: 0.84,
            aiBook: {
              title: 'The Blood Covenant',
              author: 'Raven Darkwood',
              reason: 'Dark fantasy with moral complexity'
            }
          }
        ];
      } else if (isHorror) {
        console.log('👻 Detected horror query');
        recommendations = [
          {
            id: 'ai-1',
            bookId: 'ai-horror-1',
            reason: 'A psychological horror that gets under your skin. It builds dread slowly and explores the darkness that can lurk in ordinary places and people.',
            confidence: 0.88,
            aiBook: {
              title: 'The Whispering House',
              author: 'Edgar Grimm',
              reason: 'Psychological horror with atmospheric dread'
            }
          },
          {
            id: 'ai-2',
            bookId: 'ai-horror-2',
            reason: 'Supernatural horror with a modern twist. Combines traditional ghost story elements with contemporary fears and technology.',
            confidence: 0.85,
            aiBook: {
              title: 'Digital Hauntings',
              author: 'Vera Nightshade',
              reason: 'Modern supernatural horror'
            }
          },
          {
            id: 'ai-3',
            bookId: 'ai-horror-3',
            reason: 'Body horror that explores transformation and identity. Not for the faint of heart, but masterfully written with deep psychological insights.',
            confidence: 0.82,
            aiBook: {
              title: 'The Metamorphosis Ward',
              author: 'Dr. Helena Voss',
              reason: 'Body horror with psychological depth'
            }
          }
        ];
      } else if (isPerfume) {
        console.log('🌸 Detected perfume/fragrance query');
        recommendations = [
          {
            id: 'ai-1',
            bookId: 'ai-perfume-1',
            reason: 'A fascinating exploration of the perfume industry and the art of fragrance creation. This book combines history, science, and artistry to reveal the secrets behind iconic scents.',
            confidence: 0.95,
            aiBook: {
              title: 'The Perfumer\'s Secret',
              author: 'Isabella Montclair',
              reason: 'Deep dive into perfume creation and industry secrets'
            }
          },
          {
            id: 'ai-2',
            bookId: 'ai-perfume-2',
            reason: 'A sensory journey through the world of natural fragrances and essential oils. Learn about the therapeutic properties of scents and how to create your own signature blends.',
            confidence: 0.92,
            aiBook: {
              title: 'Essence: The Art of Natural Perfumery',
              author: 'Dr. Aromatherapy Chen',
              reason: 'Natural perfumery and aromatherapy guide'
            }
          },
          {
            id: 'ai-3',
            bookId: 'ai-perfume-3',
            reason: 'A historical novel set in 18th-century France following a young perfumer\'s apprentice. Rich with sensory details and the intrigue of the French perfume trade.',
            confidence: 0.89,
            aiBook: {
              title: 'The Scent of Versailles',
              author: 'Marie-Claire Bouquet',
              reason: 'Historical fiction about perfume making in France'
            }
          }
        ];
      } else if (isSports) {
        console.log('⚽ Detected sports/fitness query');
        recommendations = [
          {
            id: 'ai-1',
            bookId: 'ai-sports-1',
            reason: queryLower.includes('football') || queryLower.includes('soccer') ?
              'The ultimate guide to football training and tactics. This comprehensive manual covers everything from basic skills to advanced strategies used by professional teams.' :
              'A comprehensive guide to athletic training and performance optimization. Covers training methods, nutrition, and mental preparation used by elite athletes.',
            confidence: 0.94,
            aiBook: {
              title: queryLower.includes('football') || queryLower.includes('soccer') ? 'The Complete Football Training Manual' : 'Peak Athletic Performance',
              author: queryLower.includes('football') || queryLower.includes('soccer') ? 'Coach Roberto Silva' : 'Dr. Michael Trainer',
              reason: 'Professional training methods and strategies'
            }
          },
          {
            id: 'ai-2',
            bookId: 'ai-sports-2',
            reason: 'Sports psychology and mental training techniques. Learn how top athletes develop mental toughness, focus, and the winning mindset.',
            confidence: 0.89,
            aiBook: {
              title: 'The Champion\'s Mind',
              author: 'Dr. Sarah Psychology',
              reason: 'Mental training and sports psychology'
            }
          },
          {
            id: 'ai-3',
            bookId: 'ai-sports-3',
            reason: queryLower.includes('nutrition') ?
              'Complete nutrition guide for athletes. Covers meal planning, supplements, and eating strategies for optimal performance and recovery.' :
              'Injury prevention and recovery strategies for athletes. Essential knowledge for staying healthy and performing at your best.',
            confidence: 0.86,
            aiBook: {
              title: queryLower.includes('nutrition') ? 'Fuel for Champions' : 'Injury-Free Training',
              author: queryLower.includes('nutrition') ? 'Nutritionist Lisa Healthy' : 'Dr. Physical Therapy',
              reason: 'Health and performance optimization'
            }
          }
        ];
      } else {
        console.log('📖 Using general recommendations based on query analysis');
        // Analyze for other keywords and provide more targeted general recommendations
        if (queryLower.includes('funny') || queryLower.includes('humor') || queryLower.includes('comedy')) {
          recommendations = [
            {
              id: 'ai-1',
              bookId: 'ai-humor-1',
              reason: 'A hilarious satirical novel that will have you laughing out loud. The author\'s wit is sharp, and the observations about modern life are spot-on.',
              confidence: 0.89,
              aiBook: {
                title: 'The Absurdist\'s Guide to Everything',
                author: 'Charlie Witman',
                reason: 'Satirical humor with social commentary'
              }
            },
            {
              id: 'ai-2',
              bookId: 'ai-humor-2',
              reason: 'A romantic comedy that perfectly balances laughs with heart. The dialogue sparkles, and the situations are both funny and believable.',
              confidence: 0.86,
              aiBook: {
                title: 'Love, Laughs, and Laundromats',
                author: 'Jenny Brightside',
                reason: 'Romantic comedy with witty dialogue'
              }
            },
            {
              id: 'ai-3',
              bookId: 'ai-humor-3',
              reason: 'A humorous memoir that finds comedy in everyday struggles. The author\'s self-deprecating humor and honest observations are refreshing.',
              confidence: 0.83,
              aiBook: {
                title: 'Failing Upward',
                author: 'Mike Chuckles',
                reason: 'Humorous memoir with relatable struggles'
              }
            }
          ];
        } else {
          // Default literary recommendations
          recommendations = [
            {
              id: 'ai-1',
              bookId: 'ai-general-1',
              reason: 'Based on your interests, this literary fiction explores universal themes of identity and belonging with beautiful, lyrical prose that will stay with you long after reading.',
              confidence: 0.85,
              aiBook: {
                title: 'The Garden of Memory',
                author: 'Amara Okafor',
                reason: 'Literary fiction with universal themes'
              }
            },
            {
              id: 'ai-2',
              bookId: 'ai-general-2',
              reason: 'A thought-provoking non-fiction that examines modern society through an engaging narrative lens. Perfect for curious readers who enjoy deep analysis.',
              confidence: 0.82,
              aiBook: {
                title: 'Digital Crossroads',
                author: 'David Kim',
                reason: 'Insightful analysis of modern society'
              }
            },
            {
              id: 'ai-3',
              bookId: 'ai-general-3',
              reason: 'This genre-blending novel combines elements of magical realism with contemporary storytelling for a unique and memorable reading experience.',
              confidence: 0.79,
              aiBook: {
                title: 'Between Worlds',
                author: 'Carmen Rodriguez',
                reason: 'Unique blend of magical realism and contemporary fiction'
              }
            }
          ];
        }
      }

      console.log('✨ Generated', recommendations.length, 'recommendations');
      resolve(recommendations);
    }, 1500); // Simulate AI processing time
  });
}

/**
 * Get user's reading lists
 */
export async function getReadingLists(): Promise<ReadingList[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/reading-lists`);
    if (!response.ok) throw new Error('Failed to fetch reading lists');
    const data = await response.json();
    return data.readingLists || [];
  } catch (error) {
    console.error('Error fetching reading lists:', error);
    // Fallback to mock data if API fails
    return mockReadingLists;
  }
}

/**
 * Create a new reading list
 */
export async function createReadingList(
  list: Omit<ReadingList, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ReadingList> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/reading-lists`, {
      method: 'POST',
      headers,
      body: JSON.stringify(list)
    });
    if (!response.ok) throw new Error('Failed to create reading list');
    const data = await response.json();
    return data.readingList;
  } catch (error) {
    console.error('Error creating reading list:', error);
    // Fallback to mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const newList: ReadingList = {
          ...list,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        resolve(newList);
      }, 500);
    });
  }
}

/**
 * Update a reading list
 */
export async function updateReadingList(
  id: string,
  list: Partial<ReadingList>
): Promise<ReadingList> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/reading-lists/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(list)
    });
    if (!response.ok) throw new Error('Failed to update reading list');
    const data = await response.json();
    return data.readingList;
  } catch (error) {
    console.error('Error updating reading list:', error);
    // Fallback to mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingList = mockReadingLists.find((l) => l.id === id);
        const updatedList: ReadingList = {
          ...existingList!,
          ...list,
          id,
          updatedAt: new Date().toISOString(),
        };
        resolve(updatedList);
      }, 500);
    });
  }
}

/**
 * Delete a reading list
 */
export async function deleteReadingList(id: string): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/reading-lists/${id}?userId=1`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) throw new Error('Failed to delete reading list');
  } catch (error) {
    console.error('Error deleting reading list:', error);
    // Fallback to mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  }
}

/**
 * Get reviews for a book
 * TODO: Replace with GET /books/:id/reviews API call
 */
export async function getReviews(bookId: string): Promise<Review[]> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockReviews: Review[] = [
        {
          id: '1',
          bookId,
          userId: '1',
          rating: 5,
          comment: 'Absolutely loved this book! A must-read.',
          createdAt: '2024-11-01T10:00:00Z',
        },
      ];
      resolve(mockReviews);
    }, 500);
  });
}

/**
 * Create a new review
 * TODO: Replace with POST /books/:bookId/reviews API call
 */
export async function createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReview: Review = {
        ...review,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      resolve(newReview);
    }, 500);
  });
}
