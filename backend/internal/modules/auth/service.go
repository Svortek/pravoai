package auth

import (
	"context"
	"errors"

	"pravoai/backend/internal/domain/user"
	"pravoai/backend/internal/pkg/password"
)

var (
	ErrUserExists   = errors.New("user already exists")
	ErrInvalidCreds = errors.New("invalid email or password")
	ErrInactive     = errors.New("user is inactive")
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Register(ctx context.Context, email, rawPassword string) error {
	existing, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		return err
	}
	if existing != nil {
		return ErrUserExists
	}

	hash, err := password.HashPassword(rawPassword)
	if err != nil {
		return err
	}

	u := &user.User{
		Email:    email,
		Password: hash,
		IsActive: true, // ВРЕМЕННО TRUE, чтобы не ломать login
	}

	return s.repo.Create(ctx, u)
}

func (s *Service) Login(ctx context.Context, email, rawPassword string) error {
	u, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		return err
	}
	if u == nil {
		return ErrInvalidCreds
	}
	if !u.IsActive {
		return ErrInactive
	}

	if err := password.ComparePassword(u.Password, rawPassword); err != nil {
		return ErrInvalidCreds
	}

	return nil
}
