package auth

import (
	"context"
	"errors"

	"pravoai/backend/internal/domain/user"
	"pravoai/backend/internal/pkg/jwt"
	"pravoai/backend/internal/pkg/password"
)

var (
	ErrUserExists    = errors.New("Этот пользователь уже зарегистрирован")
	ErrInvalidCreds  = errors.New("Неверный email или пароль")
	ErrInactive      = errors.New("Пользователь не активен")
	ErrInvalidInput  = errors.New("Некорректные данные")
)

type Service struct {
	repo         *Repository
	tokenManager *jwt.TokenManager
}

func NewService(repo *Repository, tokenManager *jwt.TokenManager) *Service {
	return &Service{
		repo:         repo,
		tokenManager: tokenManager,
	}
}

// Register - регистрация нового пользователя
func (s *Service) Register(ctx context.Context, email, name, rawPassword string) (*user.User, error) {
	// Валидация
	if email == "" || name == "" || rawPassword == "" {
		return nil, ErrInvalidInput
	}

	// Проверяем, существует ли пользователь
	existing, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, ErrUserExists
	}

	// Хешируем пароль
	hash, err := password.HashPassword(rawPassword)
	if err != nil {
		return nil, err
	}

	// Создаём пользователя
	u := &user.User{
		Email:    email,
		Name:     name,
		Password: hash,
		IsActive: true,
	}

	// Сохраняем в БД
	err = s.repo.Create(ctx, u)
	if err != nil {
		return nil, err
	}

	return u, nil
}

// Login - вход пользователя
func (s *Service) Login(ctx context.Context, email, rawPassword string) (*user.User, string, error) {
	// Валидация
	if email == "" || rawPassword == "" {
		return nil, "", ErrInvalidInput
	}

	// Ищем пользователя
	u, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		return nil, "", err
	}
	if u == nil {
		return nil, "", ErrInvalidCreds
	}
	if !u.IsActive {
		return nil, "", ErrInactive
	}

	// Проверяем пароль
	if err := password.ComparePassword(u.Password, rawPassword); err != nil {
		return nil, "", ErrInvalidCreds
	}

	// Генерируем JWT токен
	token, err := s.tokenManager.GenerateToken(u.ID, u.Email, 24*3600) // 24 часа
	if err != nil {
		return nil, "", err
	}

	return u, token, nil
}