package jwt

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"strings"
	"time"
)

// Claims represents JWT claims
type Claims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	Exp    int64  `json:"exp"`
}

// TokenManager handles JWT operations
type TokenManager struct {
	secret string
}

// NewTokenManager creates a new token manager
func NewTokenManager(secret string) *TokenManager {
	return &TokenManager{
		secret: secret,
	}
}

// GenerateToken generates a new JWT token
func (tm *TokenManager) GenerateToken(userID, email string, expiresIn time.Duration) (string, error) {
	now := time.Now()
	exp := now.Add(expiresIn).Unix()

	claims := Claims{
		UserID: userID,
		Email:  email,
		Exp:    exp,
	}

	// Create header
	header := map[string]string{
		"alg": "HS256",
		"typ": "JWT",
	}

	headerJSON, err := json.Marshal(header)
	if err != nil {
		return "", err
	}
	headerEncoded := base64.RawURLEncoding.EncodeToString(headerJSON)

	// Encode claims
	claimsJSON, err := json.Marshal(claims)
	if err != nil {
		return "", err
	}
	claimsEncoded := base64.RawURLEncoding.EncodeToString(claimsJSON)

	// Create signature
	message := headerEncoded + "." + claimsEncoded
	h := hmac.New(sha256.New, []byte(tm.secret))
	h.Write([]byte(message))
	signature := base64.RawURLEncoding.EncodeToString(h.Sum(nil))

	token := message + "." + signature
	return token, nil
}

// VerifyToken verifies and decodes a JWT token
func (tm *TokenManager) VerifyToken(token string) (*Claims, error) {
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return nil, errors.New("invalid token format")
	}

	headerEncoded := parts[0]
	claimsEncoded := parts[1]
	signatureEncoded := parts[2]

	// Verify signature
	message := headerEncoded + "." + claimsEncoded
	h := hmac.New(sha256.New, []byte(tm.secret))
	h.Write([]byte(message))
	expectedSignature := base64.RawURLEncoding.EncodeToString(h.Sum(nil))

	if !hmac.Equal([]byte(signatureEncoded), []byte(expectedSignature)) {
		return nil, errors.New("invalid token signature")
	}

	// Decode claims
	claimsJSON, err := base64.RawURLEncoding.DecodeString(claimsEncoded)
	if err != nil {
		return nil, err
	}

	var claims Claims
	err = json.Unmarshal(claimsJSON, &claims)
	if err != nil {
		return nil, err
	}

	// Check expiration
	if time.Now().Unix() > claims.Exp {
		return nil, errors.New("token expired")
	}

	return &claims, nil
}
