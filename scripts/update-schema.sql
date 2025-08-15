-- Adicionar novas colunas à tabela de produtos
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type VARCHAR(20) DEFAULT 'venda';
ALTER TABLE products ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS contact_info VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ativo';

-- Inserir usuários padrão se não existirem
INSERT INTO users (email, password, user_type) 
VALUES 
  ('admin@seagrima.com', 'admin123', 'admin'),
  ('usuario@seagrima.com', 'user123', 'cliente')
ON CONFLICT (email) DO NOTHING;

-- Inserir alguns produtos de exemplo
INSERT INTO products (name, description, price, promotional_price, category, image_url, featured, promotion, product_type, location, contact_info, user_id, status)
VALUES 
  ('Tomates Orgânicos', 'Tomates frescos cultivados sem agrotóxicos', 8.50, NULL, 'hortifruti', 'https://via.placeholder.com/300?text=Tomates+Orgânicos', true, false, 'venda', 'São Luís - MA', '(98) 99999-1234', 2, 'ativo'),
  ('Feijão Caseiro', 'Feijão produzido na agricultura familiar', 12.00, NULL, 'graos', 'https://via.placeholder.com/300?text=Feijão+Caseiro', false, false, 'venda', 'Imperatriz - MA', '(98) 99999-5678', 2, 'ativo'),
  ('Mudas de Alface', 'Mudas de alface para doação', 0.00, NULL, 'hortifruti', 'https://via.placeholder.com/300?text=Mudas+de+Alface', true, false, 'doacao', 'Caxias - MA', '(98) 99999-9012', 2, 'ativo'),
  ('Mel Puro', 'Mel de abelha 100% natural', 25.00, 20.00, 'outros', 'https://via.placeholder.com/300?text=Mel+Puro', false, true, 'venda', 'Bacabal - MA', '(98) 99999-3456', 2, 'ativo')
ON CONFLICT DO NOTHING;
