package dev.emvee.arcamt.core.security;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

public final class UserHolder {

    private static final ThreadLocal<UserContext> USER_HOLDER = new ThreadLocal<>();

    private UserHolder() {
    }

    public static void set(UserContext userContext) {
        USER_HOLDER.set(userContext);
    }

    public static UserContext get() {
        return USER_HOLDER.get();
    }

    public static Optional<UserContext> getUserContext() {
        return Optional.ofNullable(USER_HOLDER.get());
    }

    public static String getUsername() {
        UserContext context = USER_HOLDER.get();
        return context != null ? context.getUsername() : null;
    }

    public static Long getUserId() {
        UserContext context = USER_HOLDER.get();
        return context != null ? context.getUserId() : null;
    }

    public static String getEmail() {
        UserContext context = USER_HOLDER.get();
        return context != null ? context.getEmail() : null;
    }

    public static List<String> getRoles() {
        UserContext context = USER_HOLDER.get();
        return context != null && context.getRoles() != null ? context.getRoles() : Collections.emptyList();
    }

    public static boolean hasRole(String role) {
        return getRoles().contains(role);
    }

    public static void clear() {
        USER_HOLDER.remove();
    }
}
