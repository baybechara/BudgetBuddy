import TelegramBot from 'node-telegram-bot-api';
import OpenAI from 'openai';
import fetch from 'node-fetch';
import 'dotenv/config';

// Environment variables with fallbacks
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || '';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

if (!TELEGRAM_TOKEN) {
  console.error('TELEGRAM_TOKEN is required in environment variables');
  process.exit(1);
}

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is required in environment variables');
  process.exit(1);
}

// Initialize OpenAI client
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Initialize Telegram bot
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

console.log('Telegram bot started and listening for messages...');

// Handle text messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  
  // Skip commands and non-text messages
  if (!messageText || messageText.startsWith('/')) {
    return;
  }
  
  console.log(`Received message from ${chatId}: ${messageText}`);
  
  try {
    // Send typing indicator
    await bot.sendChatAction(chatId, 'typing');
    
    // Process message with OpenAI
    const productData = await processWithOpenAI(messageText, msg.photo);
    
    if (productData) {
      // Save to API
      const saved = await saveProduct(productData);
      if (saved) {
        await bot.sendMessage(chatId, 
          `✅ Товар успешно добавлен!\n\n` +
          `📦 ${productData.title}\n` +
          `🏷️ Категория: ${productData.category}\n` +
          `💰 Цена: ${productData.price} сом\n` +
          `📝 ${productData.description}`
        );
        console.log(`Product saved: ${productData.title}`);
      } else {
        await bot.sendMessage(chatId, '❌ Ошибка при сохранении товара');
      }
    } else {
      await bot.sendMessage(chatId, '❌ Не удалось распознать информацию о товаре');
    }
  } catch (error) {
    console.error('Error processing message:', error);
    await bot.sendMessage(chatId, '❌ Произошла ошибка при обработке сообщения');
  }
});

// Handle photo messages
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const caption = msg.caption || '';
  
  console.log(`Received photo from ${chatId} with caption: ${caption}`);
  
  try {
    await bot.sendChatAction(chatId, 'typing');
    
    // Get the largest photo
    const photo = msg.photo[msg.photo.length - 1];
    const fileId = photo.file_id;
    
    // Get file URL
    const file = await bot.getFile(fileId);
    const photoUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${file.file_path}`;
    
    // Process with OpenAI
    const productData = await processWithOpenAI(caption, photoUrl);
    
    if (productData) {
      // Add photo URL to product data
      productData.image = photoUrl;
      
      const saved = await saveProduct(productData);
      if (saved) {
        await bot.sendMessage(chatId, 
          `✅ Товар с фото успешно добавлен!\n\n` +
          `📦 ${productData.title}\n` +
          `🏷️ Категория: ${productData.category}\n` +
          `💰 Цена: ${productData.price} сом\n` +
          `📝 ${productData.description}`
        );
        console.log(`Product with photo saved: ${productData.title}`);
      } else {
        await bot.sendMessage(chatId, '❌ Ошибка при сохранении товара');
      }
    } else {
      await bot.sendMessage(chatId, '❌ Не удалось распознать информацию о товаре');
    }
  } catch (error) {
    console.error('Error processing photo:', error);
    await bot.sendMessage(chatId, '❌ Произошла ошибка при обработке фото');
  }
});

// Process message with OpenAI
async function processWithOpenAI(text, imageUrl = null) {
  try {
    const messages = [
      {
        role: "system",
        content: `Ты помощник для интернет-магазина. Твоя задача - извлечь информацию о товаре из сообщения пользователя и вернуть структурированные данные в формате JSON.

Требования:
1. Исправь орфографические ошибки
2. Извлеки: название товара, категорию, цену, описание
3. Если цена не указана, поставь 0
4. Цена должна быть в кыргызских сомах
5. Категории должны быть на русском: Электроника, Одежда, Дом и сад, Спорт, Книги, Автомобили, Красота, Игрушки
6. Верни только JSON в формате:
{
  "title": "Название товара",
  "category": "Категория",
  "price": числовое_значение_в_кыргызских_сомах,
  "description": "Краткое описание"
}`
      }
    ];

    if (imageUrl) {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: `Описание товара: ${text}\n\nПроанализируй также изображение и дополни информацию о товаре.`
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl
            }
          }
        ]
      });
    } else {
      messages.push({
        role: "user",
        content: `Описание товара: ${text}`
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      response_format: { type: "json_object" },
      max_tokens: 500,
      temperature: 0.3
    });

    const content = response.choices[0].message.content;
    console.log('OpenAI response:', content);
    
    const productData = JSON.parse(content);
    
    // Validate required fields
    if (!productData.title || !productData.category || typeof productData.price !== 'number') {
      console.error('Invalid product data from OpenAI:', productData);
      return null;
    }
    
    return productData;
  } catch (error) {
    console.error('Error processing with OpenAI:', error);
    return null;
  }
}

// Save product to API
async function saveProduct(productData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to save product:', await response.text());
      return null;
    }
  } catch (error) {
    console.error('Error saving product:', error);
    return null;
  }
}

// Handle bot errors
bot.on('error', (error) => {
  console.error('Telegram bot error:', error);
});

// Handle polling errors
bot.on('polling_error', (error) => {
  console.error('Telegram polling error:', error);
});

console.log('Bot is ready to receive messages!');
