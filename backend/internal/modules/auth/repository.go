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
		SELECT id, email, password_hash, is_active
		FROM users
		WHERE email = $1
	`

	var u user.User

	err := r.db.QueryRowContext(ctx, query, email).
		Scan(&u.ID, &u.Email, &u.Password, &u.IsActive)

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
		INSERT INTO users (email, password_hash, is_active)
		VALUES ($1, $2, $3)
	`
	_, err := r.db.ExecContext(ctx, query, u.Email, u.Password, u.IsActive)
	return err
}
