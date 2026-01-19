package auth

import (
	"context"
	"database/sql"
	"errors"

	"pravoai/backend/internal/domain/user"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetByEmail(ctx context.Context, email string) (*user.User, error) {
	query := `
		SELECT id, email, name, password_hash, is_active, created_at
		FROM users
		WHERE email = $1
	`

	var u user.User
	var name sql.NullString

	err := r.db.QueryRowContext(ctx, query, email).
		Scan(&u.ID, &u.Email, &name, &u.Password, &u.IsActive, &u.CreatedAt)
	
	if name.Valid {
		u.Name = name.String
	}

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &u, nil
}

func (r *Repository) Create(ctx context.Context, u *user.User) error {
	query := `
		INSERT INTO users (email, name, password_hash, is_active)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at
	`
	
	var nameValue interface{}
	if u.Name != "" {
		nameValue = u.Name
	} else {
		nameValue = nil
	}
	
	err := r.db.QueryRowContext(ctx, query, u.Email, nameValue, u.Password, u.IsActive).
		Scan(&u.ID, &u.CreatedAt)
	return err
}