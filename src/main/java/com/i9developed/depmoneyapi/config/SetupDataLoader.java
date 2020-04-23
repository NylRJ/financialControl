package com.i9developed.depmoneyapi.config;


import java.util.Arrays;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.i9developed.depmoneyapi.model.Role;
import com.i9developed.depmoneyapi.model.User;
import com.i9developed.depmoneyapi.repositories.RoleRepository;
import com.i9developed.depmoneyapi.repositories.UserRepository;

@Configuration
public class SetupDataLoader implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {

        userRepository.deleteAll();
        roleRepository.deleteAll();

        Role roleAdmin = createRoleIfNotFound("ROLE_ADMIN");
        Role roleUser = createRoleIfNotFound("ROLE_USER");

        User joao = new User("João", "Souza", "joao@gmail.com");
        User maria = new User("Maria", "Teixeira", "maria@gmail.com");

        joao.setRoles(Arrays.asList(roleAdmin));
        joao.setPassword(passwordEncoder.encode("123"));
        joao.setEnabled(true);
        maria.setRoles(Arrays.asList(roleUser));
        maria.setPassword(passwordEncoder.encode("123"));
        maria.setEnabled(true);

        createUserIfNotFound(joao);
        createUserIfNotFound(maria);
    }

    private User createUserIfNotFound(final User user) {
        Optional<User> obj = userRepository.findByEmail(user.getEmail());
        if(obj.isPresent()) {
            return obj.get();
        }
        return userRepository.save(user);
    }

    private Role createRoleIfNotFound(String name){
        Optional<Role> role = roleRepository.findByName(name);
        if (role.isPresent()){
            return role.get();
        }
        return roleRepository.save(new Role(name));
    }


}
