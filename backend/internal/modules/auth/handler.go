// internal/modules/auth/handler.go
package auth

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"pravoai/backend/internal/pkg/jwt"
)

type Handler struct {
	service      *Service
	tokenManager *jwt.TokenManager
}

func NewHandler(repo *Repository, tokenManager *jwt.TokenManager) *Handler {
	return &Handler{
		service:      NewService(repo, tokenManager),
		tokenManager: tokenManager,
	}
}

// DTO для запросов
type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Name     string `json:"name" binding:"required,min=2"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token string      `json:"token"`
	User  interface{} `json:"user"`
}

// Register - обработчик регистрации
func (h *Handler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Неверные данные",
			"details": err.Error(),
		})
		return
	}

	user, err := h.service.Register(c.Request.Context(), req.Email, req.Name, req.Password)
	if err != nil {
		status := http.StatusBadRequest
		if err == ErrUserExists {
			status = http.StatusConflict
		}
		c.JSON(status, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Генерируем токен
	token, err := h.tokenManager.GenerateToken(user.ID, user.Email, 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Ошибка генерации токена",
		})
		return
	}

	c.JSON(http.StatusCreated, AuthResponse{
		Token: token,
		User: gin.H{
			"id":         user.ID,
			"email":      user.Email,
			"name":       user.Name,
			"is_active":  user.IsActive,
			"created_at": user.CreatedAt,
		},
	})
}

// Login - обработчик входа
func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Неверные данные",
			"details": err.Error(),
		})
		return
	}

	user, token, err := h.service.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		status := http.StatusUnauthorized
		if err == ErrInactive {
			status = http.StatusForbidden
		}
		c.JSON(status, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, AuthResponse{
		Token: token,
		User: gin.H{
			"id":         user.ID,
			"email":      user.Email,
			"name":       user.Name,
			"is_active":  user.IsActive,
			"created_at": user.CreatedAt,
		},
	})
}